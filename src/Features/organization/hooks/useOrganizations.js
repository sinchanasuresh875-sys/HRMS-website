import { useState, useEffect, useMemo, useCallback } from 'react';
import { organizationApi } from '../api/organizationApi';

export function useOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [error, setError] = useState(null);
  
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch initial organizations list
  const loadOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await organizationApi.fetchOrganizations();
      setOrganizations(data);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err.message || 'Failed to load organizations.');
      showToast(err.message || 'Failed to load organizations.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    organizationApi.fetchOrganizations()
      .then((data) => {
        if (isMounted) {
          setOrganizations(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load organizations.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Combined Search and Status Filter logic
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      // 1. Status Filter
      if (statusFilter !== 'all') {
        if (org.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      // 2. Search Query (Name, Code, Industry, City, State, Email)
      if (!searchTerm.trim()) return true;
      const term = searchTerm.trim().toLowerCase();

      return (
        (org.name && org.name.toLowerCase().includes(term)) ||
        (org.code && org.code.toLowerCase().includes(term)) ||
        (org.industry && org.industry.toLowerCase().includes(term)) ||
        (org.city && org.city.toLowerCase().includes(term)) ||
        (org.state && org.state.toLowerCase().includes(term)) ||
        (org.email && org.email.toLowerCase().includes(term))
      );
    });
  }, [organizations, searchTerm, statusFilter]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalCount = organizations.length;
    const activeCount = organizations.filter((o) => o.status === 'Active').length;
    const inactiveCount = organizations.filter((o) => o.status === 'Inactive').length;

    return {
      totalCount,
      activeCount,
      inactiveCount
    };
  }, [organizations]);

  // Create Organization
  const addOrganization = async (formData) => {
    setIsSaving(true);
    setError(null);
    try {
      const created = await organizationApi.createOrganization(formData);
      setOrganizations((prev) => [created, ...prev]);
      showToast(`Organization "${created.name}" created successfully!`, 'success');
      return created;
    } catch (err) {
      showToast(err.message || 'Failed to create organization.', 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Edit Organization
  const editOrganization = async (id, formData) => {
    setIsSaving(true);
    setError(null);
    try {
      const updated = await organizationApi.updateOrganization(id, formData);
      setOrganizations((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      showToast(`Organization "${updated.name}" updated successfully!`, 'success');
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update organization.', 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Organization
  const removeOrganization = async (id) => {
    setIsDeleting(true);
    setError(null);
    try {
      const targetOrg = organizations.find((o) => o.id === id);
      const name = targetOrg ? targetOrg.name : 'Organization';
      await organizationApi.deleteOrganization(id);
      setOrganizations((prev) => prev.filter((item) => item.id !== id));
      showToast(`"${name}" deleted permanently.`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete organization.', 'error');
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle Status
  const changeStatus = async (id, newStatus) => {
    setIsStatusUpdating(true);
    setError(null);
    try {
      const updated = await organizationApi.toggleOrganizationStatus(id, newStatus);
      setOrganizations((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      showToast(
        `Organization "${updated.name}" status changed to ${newStatus}.`,
        'success'
      );
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to change status.', 'error');
      throw err;
    } finally {
      setIsStatusUpdating(false);
    }
  };

  // Reset demo mock data
  const resetDemoData = async () => {
    setIsLoading(true);
    try {
      const resetList = await organizationApi.resetMockData();
      setOrganizations(resetList);
      setSearchTerm('');
      setStatusFilter('all');
      showToast('Mock data reset to defaults.', 'success');
    } catch {
      showToast('Failed to reset mock data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    organizations,
    filteredOrganizations,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    stats,
    isLoading,
    isSaving,
    isDeleting,
    isStatusUpdating,
    error,
    toast,
    clearToast,
    loadOrganizations,
    addOrganization,
    editOrganization,
    removeOrganization,
    changeStatus,
    resetDemoData
  };
}
