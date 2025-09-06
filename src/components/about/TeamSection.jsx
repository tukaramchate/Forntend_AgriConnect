import React, { useState, useEffect } from 'react';
import { getTeamMembers } from '../../services/companyService';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setIsLoading(true);
        const data = await getTeamMembers();
        setTeamMembers(data);
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('Failed to load team information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (isLoading) {
    return <div className="ac-loading">Loading team information...</div>;
  }

  if (error) {
    return <div className="ac-error">{error}</div>;
  }

  return (
    <section className="ac-team-section">
      <div className="ac-container">
        <div className="ac-section-header">
          <h2 className="ac-section-title">Meet Our Team</h2>
          <p className="ac-section-subtitle">
            The passionate people behind AgriConnect's success
          </p>
        </div>
        <div className="ac-team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="ac-team-card">
              <div className="ac-team-image">
                <img src={member.image} alt={member.name} loading="lazy" />
              </div>
              <div className="ac-team-info">
                <h3 className="ac-team-name">{member.name}</h3>
                <p className="ac-team-position">{member.position}</p>
                <p className="ac-team-bio">{member.bio}</p>
                <div className="ac-team-social">
                  <a href={member.social.linkedin} aria-label={`${member.name} LinkedIn`}>
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href={member.social.twitter} aria-label={`${member.name} Twitter`}>
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;