"use client";

import { useState } from 'react';
import { FiSave, FiGlobe, FiLayout, FiMail, FiUsers, FiShare2, FiImage } from 'react-icons/fi';

interface SettingsState {
  general: {
    siteName: string;
    tagline: string;
    siteUrl: string;
    adminEmail: string;
    language: string;
    timezone: string;
  };
  reading: {
    postsPerPage: number;
    feedPosts: number;
    searchIndexing: boolean;
  };
  discussion: {
    allowComments: boolean;
    requireModeration: boolean;
    allowPingbacks: boolean;
    closeCommentsDays: number;
  };
  media: {
    thumbnailSize: {
      width: number;
      height: number;
    };
    mediumSize: {
      width: number;
      height: number;
    };
    largeSize: {
      width: number;
      height: number;
    };
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsState>({
    general: {
      siteName: 'My Website',
      tagline: 'Just another website',
      siteUrl: 'https://example.com',
      adminEmail: 'admin@example.com',
      language: 'en_US',
      timezone: 'UTC+0',
    },
    reading: {
      postsPerPage: 10,
      feedPosts: 10,
      searchIndexing: true,
    },
    discussion: {
      allowComments: true,
      requireModeration: true,
      allowPingbacks: false,
      closeCommentsDays: 14,
    },
    media: {
      thumbnailSize: {
        width: 150,
        height: 150,
      },
      mediumSize: {
        width: 300,
        height: 300,
      },
      largeSize: {
        width: 1024,
        height: 1024,
      },
    },
  });

  const handleSave = async () => {
    // TODO: Implement settings save functionality
    console.log('Saving settings:', settings);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Site Title</label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => setSettings({
            ...settings,
            general: { ...settings.general, siteName: e.target.value }
          })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tagline</label>
        <input
          type="text"
          value={settings.general.tagline}
          onChange={(e) => setSettings({
            ...settings,
            general: { ...settings.general, tagline: e.target.value }
          })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">In a few words, explain what this site is about.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Site URL</label>
        <input
          type="url"
          value={settings.general.siteUrl}
          onChange={(e) => setSettings({
            ...settings,
            general: { ...settings.general, siteUrl: e.target.value }
          })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Admin Email</label>
        <input
          type="email"
          value={settings.general.adminEmail}
          onChange={(e) => setSettings({
            ...settings,
            general: { ...settings.general, adminEmail: e.target.value }
          })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderReadingSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Posts per page</label>
        <input
          type="number"
          value={settings.reading.postsPerPage}
          onChange={(e) => setSettings({
            ...settings,
            reading: { ...settings.reading, postsPerPage: parseInt(e.target.value) }
          })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Feed shows most recent</label>
        <input
          type="number"
          value={settings.reading.feedPosts}
          onChange={(e) => setSettings({
            ...settings,
            reading: { ...settings.reading, feedPosts: parseInt(e.target.value) }
          })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={settings.reading.searchIndexing}
          onChange={(e) => setSettings({
            ...settings,
            reading: { ...settings.reading, searchIndexing: e.target.checked }
          })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Allow search engines to index this site
        </label>
      </div>
    </div>
  );

  const renderDiscussionSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={settings.discussion.allowComments}
          onChange={(e) => setSettings({
            ...settings,
            discussion: { ...settings.discussion, allowComments: e.target.checked }
          })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Allow people to submit comments on new posts
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={settings.discussion.requireModeration}
          onChange={(e) => setSettings({
            ...settings,
            discussion: { ...settings.discussion, requireModeration: e.target.checked }
          })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Comment must be manually approved
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Automatically close comments after
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="number"
            value={settings.discussion.closeCommentsDays}
            onChange={(e) => setSettings({
              ...settings,
              discussion: { ...settings.discussion, closeCommentsDays: parseInt(e.target.value) }
            })}
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            days
          </span>
        </div>
      </div>
    </div>
  );

  const renderMediaSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Image sizes</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Thumbnail size</label>
          <div className="mt-1 flex space-x-2">
            <div>
              <input
                type="number"
                value={settings.media.thumbnailSize.width}
                onChange={(e) => setSettings({
                  ...settings,
                  media: {
                    ...settings.media,
                    thumbnailSize: {
                      ...settings.media.thumbnailSize,
                      width: parseInt(e.target.value)
                    }
                  }
                })}
                className="block w-20 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-500">Width</span>
            </div>
            <div>
              <input
                type="number"
                value={settings.media.thumbnailSize.height}
                onChange={(e) => setSettings({
                  ...settings,
                  media: {
                    ...settings.media,
                    thumbnailSize: {
                      ...settings.media.thumbnailSize,
                      height: parseInt(e.target.value)
                    }
                  }
                })}
                className="block w-20 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-500">Height</span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Medium size</label>
          <div className="mt-1 flex space-x-2">
            <div>
              <input
                type="number"
                value={settings.media.mediumSize.width}
                onChange={(e) => setSettings({
                  ...settings,
                  media: {
                    ...settings.media,
                    mediumSize: {
                      ...settings.media.mediumSize,
                      width: parseInt(e.target.value)
                    }
                  }
                })}
                className="block w-20 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-500">Width</span>
            </div>
            <div>
              <input
                type="number"
                value={settings.media.mediumSize.height}
                onChange={(e) => setSettings({
                  ...settings,
                  media: {
                    ...settings.media,
                    mediumSize: {
                      ...settings.media.mediumSize,
                      height: parseInt(e.target.value)
                    }
                  }
                })}
                className="block w-20 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-500">Height</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600">Manage your website settings</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiSave className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <FiGlobe className="w-5 h-5" />
            General
          </button>
          <button
            onClick={() => setActiveTab('reading')}
            className={`${
              activeTab === 'reading'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <FiLayout className="w-5 h-5" />
            Reading
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`${
              activeTab === 'discussion'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <FiShare2 className="w-5 h-5" />
            Discussion
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`${
              activeTab === 'media'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <FiImage className="w-5 h-5" />
            Media
          </button>
        </nav>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'reading' && renderReadingSettings()}
        {activeTab === 'discussion' && renderDiscussionSettings()}
        {activeTab === 'media' && renderMediaSettings()}
      </div>
    </div>
  );
} 