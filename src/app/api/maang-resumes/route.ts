import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';

interface Resume {
  id: string;
  company: string;
  role: string;
  graduationYear: number;
  experience: string;
  skills: string[];
  url: string;
  source: 'linkedin' | 'github' | 'personal';
}

interface GitHubFile {
  name: string;
  download_url: string;
}

interface GitHubRepo {
  id: number;
  full_name: string;
  description: string;
}

interface GitHubSearchResponse {
  items: GitHubRepo[];
}

async function fetchLinkedInProfiles(graduationYear: number): Promise<Resume[]> {
  try {
    // Using LinkedIn's public profile search API
    const response = await axios.get('https://www.linkedin.com/search/results/people/', {
      params: {
        keywords: 'software engineer',
        origin: 'GLOBAL_SEARCH_HEADER',
        currentCompany: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'],
        graduationYear: graduationYear,
        // Add other relevant filters
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    const $ = cheerio.load(response.data);
    const profiles: Resume[] = [];

    // Parse LinkedIn search results
    $('.search-result__info').each((_, element) => {
      const name = $(element).find('.actor-name').text().trim();
      const title = $(element).find('.subline-level-1').text().trim();
      const company = $(element).find('.subline-level-2').text().trim();
      
      // Extract skills from profile
      const skills: string[] = [];
      $(element).find('.skill-pill').each((_, skill) => {
        skills.push($(skill).text().trim());
      });

      if (name && title && company) {
        profiles.push({
          id: Math.random().toString(36).substr(2, 9),
          company,
          role: title,
          graduationYear,
          experience: '2+ years', // This would need to be parsed from the profile
          skills,
          url: `https://www.linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '-')}`,
          source: 'linkedin'
        });
      }
    });

    return profiles;
  } catch (error) {
    console.error('Error fetching LinkedIn profiles:', error);
    return [];
  }
}

async function fetchGitHubResumes(graduationYear: number): Promise<Resume[]> {
  try {
    // Search GitHub for resume repositories
    const response = await axios.get<GitHubSearchResponse>('https://api.github.com/search/repositories', {
      params: {
        q: `resume ${graduationYear} filename:resume.pdf`,
        sort: 'stars',
        order: 'desc'
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ResumeRoast'
      }
    });

    const resumes: Resume[] = [];
    
    for (const repo of response.data.items) {
      try {
        // Get repository contents
        const contents = await axios.get(`https://api.github.com/repos/${repo.full_name}/contents`);
        const resumeFile = contents.data.find((file: GitHubFile) => 
          file.name.toLowerCase().includes('resume') && 
          (file.name.endsWith('.pdf') || file.name.endsWith('.md'))
        );

        if (resumeFile) {
          // Try to extract information from the repository
          const readme = await axios.get(`https://raw.githubusercontent.com/${repo.full_name}/master/README.md`);
          const $ = cheerio.load(readme.data);
          
          // Extract skills and experience from README
          const skills = $('h2:contains("Skills")').next('ul').find('li').map((_, el) => $(el).text()).get();
          
          resumes.push({
            id: repo.id.toString(),
            company: 'GitHub',
            role: repo.description || 'Software Engineer',
            graduationYear,
            experience: 'Open Source',
            skills,
            url: resumeFile.download_url,
            source: 'github'
          });
        }
      } catch (error) {
        console.error('Error processing GitHub repository:', error);
      }
    }

    return resumes;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching GitHub resumes:', axiosError.message);
    return [];
  }
}

export async function POST(request: NextRequest) {
    try {
        const { graduationYear } = await request.json();

        if (!graduationYear) {
            return NextResponse.json(
                { error: 'Graduation year is required' },
                { status: 400 }
            );
        }

        // Fetch resumes from multiple sources
        const [linkedInResumes, githubResumes] = await Promise.all([
            fetchLinkedInProfiles(graduationYear),
            fetchGitHubResumes(graduationYear)
        ]);

        // Combine and deduplicate results
        const allResumes = [...linkedInResumes, ...githubResumes];
        const uniqueResumes = Array.from(new Map(allResumes.map(resume => [resume.id, resume])).values());

        return NextResponse.json(uniqueResumes);

    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error:', axiosError.message);
        return NextResponse.json(
            { 
                error: 'Failed to fetch resumes. Please try again.',
                status: 'error'
            },
            { status: 500 }
        );
    }
} 