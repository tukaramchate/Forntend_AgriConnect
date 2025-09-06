// Mock API client - in real implementation, this would be imported from './apiClient'

/**
 * Get company statistics
 * @returns {Promise<Object>} Company stats data
 */
export const getCompanyStats = async () => {
  try {
    // This would normally call an actual API endpoint
    // const response = await api.get('/company/stats');
    // return response.data;
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          farmers: 5000,
          products: 15000,
          customers: 25000,
          orders: 100000,
          year_founded: 2020,
          sustainable_farms: 3500
        });
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching company stats:', error);
    throw new Error('Failed to fetch company statistics');
  }
};

/**
 * Get company team members
 * @returns {Promise<Array>} Team members array
 */
export const getTeamMembers = async () => {
  try {
    // This would normally call an actual API endpoint
    // const response = await api.get('/company/team');
    // return response.data;
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Rajesh Kumar',
            position: 'Founder & CEO',
            image: '/api/placeholder/300/300',
            bio: 'Former agricultural engineer with 15+ years experience in sustainable farming.',
            social: {
              linkedin: '#',
              twitter: '#'
            }
          },
          {
            id: 2,
            name: 'Priya Sharma',
            position: 'CTO',
            image: '/api/placeholder/300/300',
            bio: 'Tech expert specializing in agricultural technology and digital solutions.',
            social: {
              linkedin: '#',
              twitter: '#'
            }
          },
          {
            id: 3,
            name: 'Arjun Patel',
            position: 'Head of Operations',
            image: '/api/placeholder/300/300',
            bio: 'Supply chain specialist ensuring quality from farm to consumer.',
            social: {
              linkedin: '#',
              twitter: '#'
            }
          },
          {
            id: 4,
            name: 'Meera Singh',
            position: 'Head of Marketing',
            image: '/api/placeholder/300/300',
            bio: 'Brand strategist passionate about connecting farmers with consumers.',
            social: {
              linkedin: '#',
              twitter: '#'
            }
          }
        ]);
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw new Error('Failed to fetch team members');
  }
};