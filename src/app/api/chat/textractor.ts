interface PDFObject {
    id: number;
    generation: number;
    type: string;
    content: string;
    dictionary: Record<string, {
      Type?: string;
      Subtype?: string;
      Length?: number;
      Filter?: string | string[];
      Contents?: string | Buffer;
      Resources?: Record<string, unknown>;
      Parent?: PDFObject;
      Kids?: PDFObject[];
      Count?: number;
    }>;
  }
  
  interface PDFPage {
    pageNumber: number;
    text: string;
    resources: {
        Font?: Record<string, unknown>;
        XObject?: Record<string, unknown>;
        ExtGState?: Record<string, unknown>;
        ColorSpace?: Record<string, unknown>;
        Pattern?: Record<string, unknown>;
        Shading?: Record<string, unknown>;
        Properties?: Record<string, unknown>;
    };
  }
  
  class CustomPDFParser {
    private buffer: Buffer;
    private position: number = 0;
    private objects: Map<string, PDFObject> = new Map();
    private pages: PDFPage[] = [];
  
    constructor(buffer: Buffer) {
      this.buffer = buffer;
    }
  
    // Main extraction function
    public extractText(): { text: string; pages: PDFPage[]; success: boolean; error?: string } {
      try {
        this.validatePDF();
        this.parseObjects();
        this.extractTextFromPages();
        
        const fullText = this.pages.map(page => page.text).join('\n\n');
        
        return {
          text: fullText,
          pages: this.pages,
          success: true
        };
      } catch (error) {
        return {
          text: '',
          pages: [],
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  
    // Validate PDF header
    private validatePDF(): void {
      try {
        const header = this.buffer.slice(0, 8).toString('ascii');
        console.log('Validating PDF header:', header);
        
        // Check for PDF header or common variations
        if (!header.startsWith('%PDF-') && 
            !header.startsWith('PK') && // Some PDFs start with ZIP header
            !header.includes('PDF')) {
            throw new Error('Invalid PDF file - missing PDF header');
        }
      } catch (error) {
        console.error('PDF header validation error:', error);
        // Continue parsing even if header validation fails
        // Some PDFs might have different headers but still be valid
      }
    }
  
    // Parse PDF objects
    private parseObjects(): void {
      const content = this.buffer.toString('binary');
      
      // Find xref table
      const xrefMatch = content.match(/xref\s+(\d+)\s+(\d+)/g);
      if (!xrefMatch) {
        // Try to parse without xref (simple PDFs)
        this.parseDirectObjects();
        return;
      }
      // Parse objects using xref
      this.parseXrefObjects();
    }
  
    // Parse objects directly (for simple PDFs)
    private parseDirectObjects(): void {
      const content = this.buffer.toString('binary');
      const objectRegex = /(\d+)\s+(\d+)\s+obj\s*(.*?)\s*endobj/g;
      let match;
  
      while ((match = objectRegex.exec(content)) !== null) {
        const [, id, generation, objectContent] = match;
        
        const pdfObject: PDFObject = {
          id: parseInt(id),
          generation: parseInt(generation),
          type: this.getObjectType(objectContent),
          content: objectContent,
          dictionary: this.parseDictionary(objectContent) as PDFObject['dictionary']
        };
  
        this.objects.set(`${id}_${generation}`, pdfObject);
      }
    }
    // Parse objects using xref table
    private parseXrefObjects(): void {
      // This is a simplified version - full xref parsing is complex
      this.parseDirectObjects();
    }
    // Get object type from content
    private getObjectType(content: string): string {
      if (content.includes('/Type /Page')) return 'Page';
      if (content.includes('/Type /Pages')) return 'Pages';
      if (content.includes('/Type /Catalog')) return 'Catalog';
      if (content.includes('/Type /Font')) return 'Font';
      if (content.includes('stream')) return 'Stream';
      return 'Unknown';
    }
  
    // Parse dictionary from object content
    private parseDictionary(content: string): Record<string, unknown> {
      const dict: Record<string, unknown> = {};
      
      // Simple dictionary parsing - this is a basic implementation
      const dictRegex = /\/(\w+)\s+([^\/\s]+)/g;
      let match;
  
      while ((match = dictRegex.exec(content)) !== null) {
        const [, key, value] = match;
        dict[key] = value.trim();
      }
  
      return dict;
    }
  
    // Extract text from page objects
    private extractTextFromPages(): void {
      let pageNumber = 1;
  
      for (const [, obj] of this.objects) {
        if (obj.type === 'Page') {
          const pageText = this.extractTextFromPageObject(obj);
          
          this.pages.push({
            pageNumber: pageNumber++,
            text: pageText,
            resources: obj.dictionary
          });
        }
      }
  
      // If no pages found, try to extract from streams
      if (this.pages.length === 0) {
        this.extractTextFromStreams();
      }
    }
  
    // Extract text from a page object
    private extractTextFromPageObject(pageObj: PDFObject): string {
      let text = '';
      
      // Look for content streams
      const contentMatch = pageObj.content.match(/\/Contents\s+(\d+)/);
      if (contentMatch) {
        const contentRef = contentMatch[1];
        const contentObj = this.findObjectById(parseInt(contentRef));
        
        if (contentObj) {
          text = this.extractTextFromStream(contentObj.content);
        }
      }
  
      // Also try to extract text directly from page content
      const directText = this.extractTextFromStream(pageObj.content);
      if (directText) {
        text += directText;
      }
  
      return text;
    }
  
    // Extract text from all stream objects
    private extractTextFromStreams(): void {
      let pageNumber = 1;
  
      for (const [, obj] of this.objects) {
        if (obj.type === 'Stream' || obj.content.includes('stream')) {
          const text = this.extractTextFromStream(obj.content);
          
          if (text.trim()) {
            this.pages.push({
              pageNumber: pageNumber++,
              text: text,
              resources: obj.dictionary
            });
          }
        }
      }
    }
  
    // Extract text from stream content
    private extractTextFromStream(content: string): string {
      let text = '';
  
      try {
        // Look for text between 'stream' and 'endstream'
        const streamMatch = content.match(/stream\s*(.*?)\s*endstream/);
        if (streamMatch) {
          const streamContent = streamMatch[1];
          text = this.decodeStreamContent(streamContent);
        }
  
        // Also look for text operations directly in content
        text += this.extractTextOperations(content);
  
        // Look for text in parentheses (common PDF text format)
        const textMatches = content.match(/\(([^)]*)\)/g);
        if (textMatches) {
          for (const match of textMatches) {
            const textContent = match.slice(1, -1); // Remove parentheses
            if (textContent.trim()) {
              text += this.decodeTextString(textContent) + ' ';
            }
          }
        }
  
        // Look for text in angle brackets (another common format)
        const angleMatches = content.match(/<([^>]*)>/g);
        if (angleMatches) {
          for (const match of angleMatches) {
            const textContent = match.slice(1, -1); // Remove angle brackets
            if (textContent.trim()) {
              text += this.decodeTextString(textContent) + ' ';
            }
          }
        }
  
        return text.trim();
      } catch (error) {
        console.error('Error extracting text from stream:', error);
        return '';
      }
    }
  
    // Decode stream content (basic implementation)
    private decodeStreamContent(streamContent: string): string {
      // This is a simplified decoder
      // Real PDFs might use FlateDecode, ASCII85Decode, etc.
      
      let decoded = streamContent;
  
      // Remove common PDF stream artifacts
      decoded = decoded.replace(/\s*q\s*/g, ''); // Save graphics state
      decoded = decoded.replace(/\s*Q\s*/g, ''); // Restore graphics state
      decoded = decoded.replace(/\s*BT\s*/g, ''); // Begin text
      decoded = decoded.replace(/\s*ET\s*/g, ''); // End text
      decoded = decoded.replace(/\/\w+\s+\d+\s+Tf/g, ''); // Font settings
      decoded = decoded.replace(/\d+\s+\d+\s+Td/g, ''); // Text positioning
      decoded = decoded.replace(/\d+\.?\d*\s+TL/g, ''); // Text leading
  
      return this.extractTextOperations(decoded);
    }
  
    // Extract text operations (Tj, TJ commands)
    private extractTextOperations(content: string): string {
      let text = '';
  
      // Extract text from Tj operations (show text)
      const tjRegex = /\(([^)]*)\)\s*Tj/g;
      let match;
  
      while ((match = tjRegex.exec(content)) !== null) {
        text += this.decodeTextString(match[1]) + ' ';
      }
  
      // Extract text from TJ operations (show text with individual glyph positioning)
      const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
      while ((match = tjArrayRegex.exec(content)) !== null) {
        const arrayContent = match[1];
        const textParts = arrayContent.match(/\(([^)]*)\)/g);
        
        if (textParts) {
          for (const part of textParts) {
            const textMatch = part.match(/\(([^)]*)\)/);
            if (textMatch) {
              text += this.decodeTextString(textMatch[1]) + ' ';
            }
          }
        }
      }
  
      return text.trim();
    }
  
    // Decode text string (handle escape sequences)
    private decodeTextString(text: string): string {
      return text
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\b/g, '\b')
        .replace(/\\f/g, '\f')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\')
        .replace(/\\(\d{3})/g, (match, octal) => String.fromCharCode(parseInt(octal, 8)));
    }
  
    // Find object by ID
    private findObjectById(id: number): PDFObject | undefined {
      for (const [, obj] of this.objects) {
        if (obj.id === id) {
          return obj;
        }
      }
      return undefined;
    }
  }
  
  // Main extraction function
  export function extractTextFromPDF(buffer: Buffer): {
    text: string;
    pages: PDFPage[];
    success: boolean;
    error?: string;
    numPages: number;
  } {
    const parser = new CustomPDFParser(buffer);
    const result = parser.extractText();
    
    return {
      ...result,
      numPages: result.pages.length
    };
  }
  
  // Helper function for file input
  export function extractTextFromPDFFile(file: File): Promise<{
    text: string;
    pages: PDFPage[];
    success: boolean;
    error?: string;
    numPages: number;
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const buffer = Buffer.from(arrayBuffer);
          const result = extractTextFromPDF(buffer);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }
  
  // Helper function for base64 input
  export function extractTextFromBase64PDF(base64Data: string): {
    text: string;
    pages: PDFPage[];
    success: boolean;
    error?: string;
    numPages: number;
  } {
    try {
      const base64Content = base64Data.replace(/^data:application\/pdf;base64,/, '');
      const buffer = Buffer.from(base64Content, 'base64');
      return extractTextFromPDF(buffer);
    } catch (error) {
      return {
        text: '',
        pages: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        numPages: 0
      };
    }
  }