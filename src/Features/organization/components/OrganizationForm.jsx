import { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import {
  INDUSTRY_OPTIONS,
  TYPE_OPTIONS,
  TIMEZONE_OPTIONS,
  CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS
} from '../api/mockData';

const DEFAULT_FORM_STATE = {
  logo: '',
  name: '',
  code: '',
  type: 'Enterprise',
  industry: 'Information Technology',
  description: '',
  email: '',
  phone: '',
  alternatePhone: '',
  website: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: 'United States',
  postalCode: '',
  registrationNumber: '',
  taxId: '',
  establishedDate: '',
  timezone: 'America/New_York (UTC-04:00)',
  currency: 'USD ($)',
  dateFormat: 'YYYY-MM-DD',
  status: 'Active'
};

export default function OrganizationForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false
}) {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        logo: initialData.logo || '',
        name: initialData.name || '',
        code: initialData.code || '',
        type: initialData.type || 'Enterprise',
        industry: initialData.industry || 'Information Technology',
        description: initialData.description || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        alternatePhone: initialData.alternatePhone || '',
        website: initialData.website || '',
        addressLine1: initialData.addressLine1 || '',
        addressLine2: initialData.addressLine2 || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || 'United States',
        postalCode: initialData.postalCode || '',
        registrationNumber: initialData.registrationNumber || '',
        taxId: initialData.taxId || '',
        establishedDate: initialData.establishedDate || '',
        timezone: initialData.timezone || 'America/New_York (UTC-04:00)',
        currency: initialData.currency || 'USD ($)',
        dateFormat: initialData.dateFormat || 'YYYY-MM-DD',
        status: initialData.status || 'Active'
      };
    }
    return DEFAULT_FORM_STATE;
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  const isEdit = Boolean(initialData && initialData.id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Basic Info
    if (!formData.name.trim()) {
      newErrors.name = 'Organization Name is required.';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Organization Code is required.';
    } else if (!/^[A-Za-z0-9_-]+$/.test(formData.code.trim())) {
      newErrors.code = 'Code must contain only letters, numbers, hyphens, or underscores.';
    }

    // Contact Info
    if (!formData.email.trim()) {
      newErrors.email = 'Official Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required.';
    } else if (!/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number with at least 7 digits.';
    }

    if (formData.website.trim()) {
      const urlPattern = /^(https?:\/\/)?([\w.-]+)+[\w\-_~:/?#[\]@!$&'()*+,;=.]+$/i;
      if (!urlPattern.test(formData.website.trim())) {
        newErrors.website = 'Please enter a valid URL (e.g., https://example.com).';
      }
    }

    // Address
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address Line 1 is required.';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State / Province is required.';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required.';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal Code is required.';
    }

    // Established Date validation
    if (formData.establishedDate) {
      const selected = new Date(formData.establishedDate);
      const now = new Date();
      if (selected > now) {
        newErrors.establishedDate = 'Established date cannot be in the future.';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name || newErrors.code) setActiveTab('basic');
      else if (newErrors.email || newErrors.phone || newErrors.website) setActiveTab('contact');
      else if (newErrors.addressLine1 || newErrors.city || newErrors.state || newErrors.country || newErrors.postalCode) setActiveTab('address');
      else if (newErrors.establishedDate) setActiveTab('company');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const hasTabError = (tabName) => {
    if (tabName === 'basic') return Boolean(errors.name || errors.code);
    if (tabName === 'contact') return Boolean(errors.email || errors.phone || errors.website);
    if (tabName === 'address') return Boolean(errors.addressLine1 || errors.city || errors.state || errors.country || errors.postalCode);
    if (tabName === 'company') return Boolean(errors.establishedDate);
    return false;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Organization' : 'Create New Organization'}
      subtitle={isEdit ? `Update details for ${initialData?.name}` : 'Fill in the required information to add a new organization.'}
      maxWidth="780px"
    >
      <form onSubmit={handleSubmit} noValidate className="org-form">
        {/* Form Navigation Tabs */}
        <div className="org-form-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'basic' ? 'active' : ''} ${hasTabError('basic') ? 'has-tab-error' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'contact' ? 'active' : ''} ${hasTabError('contact') ? 'has-tab-error' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'address' ? 'active' : ''} ${hasTabError('address') ? 'has-tab-error' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            Address
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'company' ? 'active' : ''} ${hasTabError('company') ? 'has-tab-error' : ''}`}
            onClick={() => setActiveTab('company')}
          >
            Company Info
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings & Status
          </button>
        </div>

        {/* Tab 1: Basic Information */}
        {activeTab === 'basic' && (
          <div className="tab-pane">
            <div className="logo-upload-preview">
              <div className="logo-preview-box">
                <img
                  src={formData.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Org')}&background=6366f1&color=fff`}
                  alt="Logo Preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://ui-avatars.com/api/?name=Org&background=6366f1&color=fff';
                  }}
                />
              </div>
              <div className="logo-url-input">
                <Input
                  label="Logo Image URL"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  helperText="Leave empty to auto-generate a brand logo avatar."
                />
              </div>
            </div>

            <div className="form-grid grid-2">
              <Input
                label="Organization Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={errors.name}
                placeholder="e.g., Acme Technologies"
              />

              <Input
                label="Organization Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                error={errors.code}
                placeholder="e.g., ACME-TECH"
              />
            </div>

            <div className="form-grid grid-2">
              <Select
                label="Organization Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={TYPE_OPTIONS}
              />

              <Select
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                options={INDUSTRY_OPTIONS}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the organization's business and primary goals..."
              />
            </div>
          </div>
        )}

        {/* Tab 2: Contact Information */}
        {activeTab === 'contact' && (
          <div className="tab-pane">
            <div className="form-grid grid-2">
              <Input
                label="Official Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
                placeholder="corporate@company.com"
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                error={errors.phone}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="form-grid grid-2">
              <Input
                label="Alternate Phone"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0001 (Optional)"
              />

              <Input
                label="Official Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                error={errors.website}
                placeholder="https://company.com"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Address */}
        {activeTab === 'address' && (
          <div className="tab-pane">
            <Input
              label="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              required
              error={errors.addressLine1}
              placeholder="Street address, P.O. box, or building number"
            />

            <Input
              label="Address Line 2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Apartment, suite, unit, building, floor, etc."
            />

            <div className="form-grid grid-2">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                error={errors.city}
                placeholder="City name"
              />

              <Input
                label="State / Province / Region"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                error={errors.state}
                placeholder="State or Province"
              />
            </div>

            <div className="form-grid grid-2">
              <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                error={errors.country}
                placeholder="Country name"
              />

              <Input
                label="Postal / Zip Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                error={errors.postalCode}
                placeholder="e.g., 90210"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Company Information */}
        {activeTab === 'company' && (
          <div className="tab-pane">
            <div className="form-grid grid-2">
              <Input
                label="Registration Number"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="e.g., REG-2023-8890"
              />

              <Input
                label="Tax Identification Number (TIN/EIN)"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                placeholder="e.g., US-99-1234567"
              />
            </div>

            <Input
              label="Established Date"
              name="establishedDate"
              type="date"
              value={formData.establishedDate}
              onChange={handleChange}
              error={errors.establishedDate}
            />
          </div>
        )}

        {/* Tab 5: Settings & Status */}
        {activeTab === 'settings' && (
          <div className="tab-pane">
            <div className="form-grid grid-3">
              <Select
                label="Timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                options={TIMEZONE_OPTIONS}
              />

              <Select
                label="Currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                options={CURRENCY_OPTIONS}
              />

              <Select
                label="Date Format"
                name="dateFormat"
                value={formData.dateFormat}
                onChange={handleChange}
                options={DATE_FORMAT_OPTIONS}
              />
            </div>

            <div className="form-group margin-top-md">
              <label className="form-label">Status</label>
              <div className="status-radio-group">
                <label className={`status-radio-card ${formData.status === 'Active' ? 'selected-active' : ''}`}>
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={handleChange}
                  />
                  <div className="status-radio-text">
                    <strong>Active</strong>
                    <span>Organization is operational and accessible.</span>
                  </div>
                </label>

                <label className={`status-radio-card ${formData.status === 'Inactive' ? 'selected-inactive' : ''}`}>
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={handleChange}
                  />
                  <div className="status-radio-text">
                    <strong>Inactive</strong>
                    <span>Organization is suspended or disabled.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Modal Action Controls */}
        <div className="org-form-actions">
          <div className="tab-stepper">
            {activeTab !== 'basic' && (
              <Button
                variant="outline"
                onClick={() => {
                  const tabs = ['basic', 'contact', 'address', 'company', 'settings'];
                  const idx = tabs.indexOf(activeTab);
                  if (idx > 0) setActiveTab(tabs[idx - 1]);
                }}
              >
                Back
              </Button>
            )}
            {activeTab !== 'settings' && (
              <Button
                variant="secondary"
                onClick={() => {
                  const tabs = ['basic', 'contact', 'address', 'company', 'settings'];
                  const idx = tabs.indexOf(activeTab);
                  if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
                }}
              >
                Next Section &rarr;
              </Button>
            )}
          </div>

          <div className="form-final-btns">
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {isEdit ? 'Save Changes' : 'Create Organization'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
