import { Report } from '../types';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzR6aJZySexZH5LJGC8sSbCuY34Dx2cI1-NzrfMwzYPnsH0CpttK9sBOGPqlXnPV4w_/exec';

export const ReportService = {
  async fetchReports(): Promise<{ reports: Report[], isLive: boolean }> {
    try {
      const response = await fetch(`${SCRIPT_URL}?t=${Date.now()}`);
      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();
      const sortedData = Array.isArray(data) ? data.sort((a: any, b: any) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      ) : [];
      
      localStorage.setItem('pppk_reports', JSON.stringify(sortedData));
      return { reports: sortedData, isLive: true };
    } catch (error) {
      const saved = localStorage.getItem('pppk_reports');
      return { reports: saved ? JSON.parse(saved) : [], isLive: false };
    }
  },

  async addReport(report: Report): Promise<boolean> {
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      return true; 
    } catch (error) {
      const saved = localStorage.getItem('pppk_reports');
      const reports = saved ? JSON.parse(saved) : [];
      localStorage.setItem('pppk_reports', JSON.stringify([report, ...reports]));
      return true;
    }
  },

  async deleteReport(id: string): Promise<boolean> {
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      return true;
    } catch (error) {
      const saved = localStorage.getItem('pppk_reports');
      if (saved) {
        const reports = JSON.parse(saved).filter((r: Report) => r.id !== id);
        localStorage.setItem('pppk_reports', JSON.stringify(reports));
      }
      return true;
    }
  }
};