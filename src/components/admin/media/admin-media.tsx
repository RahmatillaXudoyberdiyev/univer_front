'use client'

import { useTranslations } from 'next-intl'

import { useState } from 'react'

import Cookies from 'js-cookie'

import AdminNews from './admin-news'

const AdminPublication = ({
    tab,
}: {
    tab: 'news' | 'events' | 'announcements' | undefined
}) => {
    const t = useTranslations()
    const [activeTab, setActiveTab] = useState<
        'news' | 'events' | 'announcements'
    >(tab || 'news')

    const [addModalOpen, setAddModalOpen] = useState<boolean>(false)

    return (
        <div className="container-cs py-5 mb-5">
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div className="inline-flex rounded-lg bg-gray-100 dark:bg-[#0A0A3D] p-1">
                        <button
                            onClick={() => {
                                setActiveTab('news')
                                Cookies.set('admin-publication-tab', 'news')
                            }}
                            className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                                activeTab === 'news'
                                    ? 'bg-white dark:bg-[#372AAC] dark:text-white text-[#2B2B7A] shadow-sm'
                                    : 'text-gray-700 dark:text-white dark:hover:text-gray-900'
                            }`}
                        >
                            {t('Yangiliklar')}
                        </button>
                    </div>

                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white px-5 py-3"
                    >
                        Qo'shish
                    </button>
                </div>
            </div>
            {activeTab === 'news' && (
                <AdminNews
                    activeTab={activeTab}
                    newsModalOpen={addModalOpen}
                    setNewsModalOpen={setAddModalOpen}
                />
            )}
        </div>
    )
}

export default AdminPublication
