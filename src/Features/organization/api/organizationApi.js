import { INITIAL_ORGANIZATIONS } from './mockData';

const STORAGE_KEY = 'hrms_organizations_mock';
const SIMULATED_DELAY_MS = 400;

// Helper to get stored items or initialize from mock data
const getStoredOrganizations = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read organizations from localStorage:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORGANIZATIONS));
  return INITIAL_ORGANIZATIONS;
};

// Helper to persist state
const saveOrganizations = (organizations) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(organizations));
  } catch (e) {
    console.error('Failed to save organizations to localStorage:', e);
  }
};

const delay = (ms = SIMULATED_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Organization API Service Layer
 * Designed to mirror Spring Boot REST endpoints:
 * GET    /api/v1/organizations
 * GET    /api/v1/organizations/{id}
 * POST   /api/v1/organizations
 * PUT    /api/v1/organizations/{id}
 * DELETE /api/v1/organizations/{id}
 * PATCH  /api/v1/organizations/{id}/status
 */
export const organizationApi = {
  // Fetch all organizations
  async fetchOrganizations() {
    await delay(350);
    const orgs = getStoredOrganizations();
    return [...orgs];
  },

  // Fetch organization by ID
  async getOrganizationById(id) {
    await delay(250);
    const orgs = getStoredOrganizations();
    const found = orgs.find((item) => item.id === id);
    if (!found) {
      throw new Error(`Organization with ID ${id} not found.`);
    }
    return { ...found };
  },

  // Create a new organization
  async createOrganization(data) {
    await delay(500);
    const orgs = getStoredOrganizations();
    
    // Check for duplicate organization code
    const existingCode = orgs.find(
      (o) => o.code.trim().toLowerCase() === data.code.trim().toLowerCase()
    );
    if (existingCode) {
      throw new Error(`Organization Code "${data.code}" already exists.`);
    }

    const newOrganization = {
      ...data,
      id: `org-${Date.now().toString().slice(-6)}`,
      status: data.status || 'Active',
      createdAt: new Date().toISOString(),
      logo: data.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366f1&color=fff`
    };

    const updated = [newOrganization, ...orgs];
    saveOrganizations(updated);
    return { ...newOrganization };
  },

  // Update existing organization
  async updateOrganization(id, data) {
    await delay(450);
    const orgs = getStoredOrganizations();
    const index = orgs.findIndex((item) => item.id === id);
    
    if (index === -1) {
      throw new Error(`Organization not found.`);
    }

    // Check code duplication excluding current
    const duplicateCode = orgs.find(
      (o) => o.id !== id && o.code.trim().toLowerCase() === data.code.trim().toLowerCase()
    );
    if (duplicateCode) {
      throw new Error(`Organization Code "${data.code}" is already in use by another company.`);
    }

    const updatedOrg = {
      ...orgs[index],
      ...data,
      id, // Preserve ID
      updatedAt: new Date().toISOString()
    };

    orgs[index] = updatedOrg;
    saveOrganizations(orgs);
    return { ...updatedOrg };
  },

  // Delete organization
  async deleteOrganization(id) {
    await delay(400);
    const orgs = getStoredOrganizations();
    const filtered = orgs.filter((item) => item.id !== id);
    if (filtered.length === orgs.length) {
      throw new Error(`Organization not found for deletion.`);
    }
    saveOrganizations(filtered);
    return { success: true, id };
  },

  // Toggle status
  async toggleOrganizationStatus(id, newStatus) {
    await delay(350);
    const orgs = getStoredOrganizations();
    const index = orgs.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Organization not found.`);
    }

    orgs[index] = {
      ...orgs[index],
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    saveOrganizations(orgs);
    return { ...orgs[index] };
  },

  // Reset to initial mock data (convenience for demo testing)
  async resetMockData() {
    await delay(200);
    saveOrganizations(INITIAL_ORGANIZATIONS);
    return [...INITIAL_ORGANIZATIONS];
  }
};
