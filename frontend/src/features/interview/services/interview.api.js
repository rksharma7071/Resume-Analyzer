import { api } from "../../auth/services/api.js";

const BASE = "/api/interviewReport";

export const generateInterviewReport = ({ jobDescription, selfDescription, resumeFile }) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  return api.post(BASE, formData).then((res) => res.data.interviewReport);
};

export const getAllInterviewReports = () => api.get(BASE).then((res) => res.data.interviewReports);

export const getInterviewReportById = (id) => api.get(`${BASE}/${id}`).then((res) => res.data.interviewReport);

export const renameInterviewReport = (id, title) => api.patch(`${BASE}/${id}`, { title }).then((res) => res.data.interviewReport);

export const deleteInterviewReport = (id) => api.delete(`${BASE}/${id}`);