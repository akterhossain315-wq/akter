import React, { useState, useEffect } from "react";

function sampleJobs() {
  return [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions Ltd",
      location: "Dhaka, Bangladesh",
      type: "Full-time",
      salary: "৳40,000 - ৳70,000",
      postedAt: "2025-11-01",
      description:
        "Looking for a React developer with 2+ years experience. Tailwind CSS knowledge is a plus.",
    },
    {
      id: 2,
      title: "Customer Support Executive",
      company: "ServiceNow BD",
      location: "Dhaka (Remote possible)",
      type: "Part-time",
      salary: "(Grade-16)৳12,000 - ৳20,000",
      postedAt: "2025-10-28",
      description:
        "Provide customer support via phone and chat. Good communication in Bengali & English required.",
    },
  ];
}

export default function JobBoard() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : sampleJobs();
  });

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  const filteredJobs = jobs.filter((job) => {
    const q = query.toLowerCase();
    if (filter !== "all" && job.type.toLowerCase() !== filter) return false;
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q)
    );
  });

  function addJob(newJob) {
    setJobs([{ ...newJob, id: Date.now() }, ...jobs]);
    setShowAdd(false);
  }

  const styles = {
    container: {
      maxWidth: 700,
      margin: "auto",
      padding: 20,
      fontFamily: "Arial",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: 4,
      cursor: "pointer",
    },
    input: {
      padding: 8,
      fontSize: 14,
      flexGrow: 1,
      marginRight: 10,
      borderRadius: 4,
      border: "1px solid #ccc",
    },
    select: {
      padding: 8,
      fontSize: 14,
      borderRadius: 4,
      border: "1px solid #ccc",
    },
    jobCard: {
      border: "1px solid #ccc",
      borderRadius: 6,
      padding: 15,
      marginBottom: 15,
      cursor: "pointer",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    },
    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 6,
      width: "90%",
      maxWidth: 500,
      maxHeight: "90vh",
      overflowY: "auto",
    },
    textarea: {
      width: "100%",
      height: 80,
      padding: 8,
      borderRadius: 4,
      border: "1px solid #ccc",
      fontSize: 14,
    },
    formGroup: { marginBottom: 12 },
    formLabel: { display: "block", marginBottom: 4, fontWeight: "bold" },
    closeButton: {
      backgroundColor: "#ccc",
      border: "none",
      padding: "5px 10px",
      borderRadius: 4,
      cursor: "pointer",
      float: "right",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Update gov job circular bd</h1>
        <button style={styles.button} onClick={() => setShowAdd(true)}>
          Add Job
        </button>
      </header>

      <section style={{ display: "flex", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by title, company or location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="remote">Remote</option>
          <option value="internship">Internship</option>
        </select>
      </section>

      <main>
        {filteredJobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <article
              key={job.id}
              style={styles.jobCard}
              onClick={() => setSelectedJob(job)}
            >
              <h2>{job.title}</h2>
              <p>
                {job.company} • {job.location}
              </p>
              <p style={{ fontSize: 12, color: "#555" }}>
                {job.type} | Posted: {job.postedAt}
              </p>
              <p style={{ fontWeight: "bold" }}>{job.salary}</p>
            </article>
          ))
        )}
      </main>

      {/* Add Job Modal */}
      {showAdd && (
        <div style={styles.modalOverlay}>
          <AddJobForm
            onCancel={() => setShowAdd(false)}
            onAdd={addJob}
            styles={styles}
          />
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div style={styles.modalOverlay}>
          <JobDetailsModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            styles={styles}
          />
        </div>
      )}
    </div>
  );
}

function AddJobForm({ onCancel, onAdd, styles }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [salary, setSalary] = useState("");
  const [postedAt, setPostedAt] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title || !company) {
      alert("Please enter job title and company.");
      return;
    }
    onAdd({ title, company, location, type, salary, postedAt, description });
  }

  return (
    <form onSubmit={handleSubmit} style={styles.modalContent}>
      <button type="button" onClick={onCancel} style={styles.closeButton}>
        ✕
      </button>
      <h3 style={{ marginTop: 0 }}>Add New Job</h3>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Job Title*</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ ...styles.input, width: "100%", marginBottom: 0 }}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Company*</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ ...styles.input, width: "100%", marginBottom: 0 }}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ ...styles.input, width: "100%", marginBottom: 0 }}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ ...styles.select, width: "100%", marginBottom: 0 }}
        >
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Remote</option>
          <option>Internship</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Salary</label>
        <input
          type="text"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          style={{ ...styles.input, width: "100%", marginBottom: 0 }}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Posted At</label>
        <input
          type="date"
          value={postedAt}
          onChange={(e) => setPostedAt(e.target.value)}
          style={{ ...styles.input, width: "100%", marginBottom: 0 }}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
      </div>

      <div style={{ textAlign: "right" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            marginRight: 5,
            padding: "8px 16px",
            borderRadius: 4,
            border: "1px solid #ccc",
            backgroundColor: "#eee",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button type="submit" style={{ ...styles.button, cursor: "pointer" }}>
          Add Job
        </button>
      </div>
    </form>
  );
}

function JobDetailsModal({ job, onClose, styles }) {
  return (
    <div style={styles.modalContent}>
      <button onClick={onClose} style={styles.closeButton}>
        ✕
      </button>
      <h2>{job.title}</h2>
      <p>
        {job.company} • {job.location}
      </p>
      <p style={{ fontSize: 12, color: "#555" }}>
        {job.type} | Posted: {job.postedAt}
      </p>
      <p style={{ fontWeight: "bold" }}>Salary: {job.salary}</p>
      <p style={{ whiteSpace: "pre-line" }}>{job.description}</p>
    </div>
  );
}
