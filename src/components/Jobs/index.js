// Refactored Jobs component using functional React with hooks

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { BsSearch } from 'react-icons/bs';
import Loader from 'react-loader-spinner';
import Header from '../Header';
import JobItem from '../JobItem';
import './index.css';

const employmentTypesList = [
  { label: 'Full Time', employmentTypeId: 'FULLTIME' },
  { label: 'Part Time', employmentTypeId: 'PARTTIME' },
  { label: 'Freelance', employmentTypeId: 'FREELANCE' },
  { label: 'Internship', employmentTypeId: 'INTERNSHIP' },
];

const salaryRangesList = [
  { salaryRangeId: '1000000', label: '10 LPA and above' },
  { salaryRangeId: '2000000', label: '20 LPA and above' },
  { salaryRangeId: '3000000', label: '30 LPA and above' },
  { salaryRangeId: '4000000', label: '40 LPA and above' },
];

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

const Jobs = () => {
  const [jobsList, setJobsList] = useState([]);
  const [profileDetails, setProfileDetails] = useState(null);
  const [apiProfileStatus, setApiProfileStatus] = useState(apiStatusConstants.initial);
  const [apiJobsStatus, setApiJobsStatus] = useState(apiStatusConstants.initial);
  const [employmentType, setEmploymentType] = useState([]);
  const [salaryRange, setSalaryRange] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [employmentType, salaryRange, searchInput]);

  const fetchProfile = async () => {
    setApiProfileStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get('jwt_token');
    const response = await fetch('https://apis.ccbp.in/profile', {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    if (response.ok) {
      const data = await response.json();
      const profile = data.profile_details;
      setProfileDetails({
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      });
      setApiProfileStatus(apiStatusConstants.success);
    } else {
      setApiProfileStatus(apiStatusConstants.failure);
    }
  };

  const fetchJobs = async () => {
    setApiJobsStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get('jwt_token');
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(',')}&minimum_package=${salaryRange}&search=${searchInput}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    if (response.ok) {
      const data = await response.json();
      const jobs = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        rating: job.rating,
        location: job.location,
        employmentType: job.employment_type,
        packagePerAnnum: job.package_per_annum,
        jobDescription: job.job_description,
        companyLogoUrl: job.company_logo_url,
      }));
      setJobsList(jobs);
      setApiJobsStatus(apiStatusConstants.success);
    } else {
      setApiJobsStatus(apiStatusConstants.failure);
    }
  };

  const toggleEmploymentType = type => {
    setEmploymentType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  );

  const renderProfile = () => {
    if (apiProfileStatus === apiStatusConstants.inProgress) return renderLoader();
    if (apiProfileStatus === apiStatusConstants.failure)
      return <button onClick={fetchProfile}>Retry</button>;
    if (profileDetails)
      return (
        <div className="card-container">
          <img src={profileDetails.profileImageUrl} alt="profile" className="profile" />
          <h1>{profileDetails.name}</h1>
          <p>{profileDetails.shortBio}</p>
        </div>
      );
  };

  const renderFilters = () => (
    <div className="filter-section">
      <h1>Type of Employment</h1>
      {employmentTypesList.map(type => (
        <div key={type.employmentTypeId}>
          <input
            type="checkbox"
            id={type.employmentTypeId}
            onChange={() => toggleEmploymentType(type.employmentTypeId)}
            checked={employmentType.includes(type.employmentTypeId)}
          />
          <label htmlFor={type.employmentTypeId}>{type.label}</label>
        </div>
      ))}
      <h1>Salary Range</h1>
      {salaryRangesList.map(salary => (
        <div key={salary.salaryRangeId}>
          <input
            type="radio"
            name="salary"
            id={salary.salaryRangeId}
            checked={salaryRange === salary.salaryRangeId}
            onChange={() => setSalaryRange(salary.salaryRangeId)}
          />
          <label htmlFor={salary.salaryRangeId}>{salary.label}</label>
        </div>
      ))}
    </div>
  );

  const renderJobs = () => {
    if (apiJobsStatus === apiStatusConstants.inProgress) return renderLoader();
    if (apiJobsStatus === apiStatusConstants.failure)
      return <button onClick={fetchJobs}>Retry</button>;
    if (jobsList.length === 0) return <p>No Jobs Found</p>;

    return (
      <ul>
        {jobsList.map(job => (
          <JobItem key={job.id} jobData={job} />
        ))}
      </ul>
    );
  };

  return (
    <div className="jobs-main-container">
      <Header />
      <div className="jobs-container">
        <aside>{renderProfile()}{renderFilters()}</aside>
        <main>
          <div className="search-container">
            <input
              type="search"
              placeholder="Search"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button onClick={fetchJobs} data-testid="searchButton">
              <BsSearch />
            </button>
          </div>
          {renderJobs()}
        </main>
      </div>
    </div>
  );
};

export default Jobs;
