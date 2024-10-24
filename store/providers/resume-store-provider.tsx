/* eslint-disable no-unused-vars */
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { type ResumeStore, createResumeStore } from '../resume-store'

// Define the store API type
export type ResumeStoreApi = ReturnType<typeof createResumeStore>

// Create context
export const ResumeStoreContext = createContext<ResumeStoreApi | undefined>(
  undefined
)

// Provider Props interface
export interface ResumeStoreProviderProps {
  children: ReactNode
}

// Provider Component
export const ResumeStoreProvider = ({ children }: ResumeStoreProviderProps) => {
  const storeRef = useRef<ResumeStoreApi>()
  
  if (!storeRef.current) {
    storeRef.current = createResumeStore()
  }

  return (
    <ResumeStoreContext.Provider value={storeRef.current}>
      {children}
    </ResumeStoreContext.Provider>
  )
}

// Custom hook to use the store
export const useResumeStore = <T,>(selector: (store: ResumeStore) => T): T => {
  const store = useContext(ResumeStoreContext)
  
  if (!store) {
    throw new Error(`useResumeStore must be used within ResumeStoreProvider`)
  }

  return useStore(store, selector)
}

// Selector hooks
export const usePersonalInfo = () => 
  useResumeStore((state) => state.personalInfo)

export const useEducationInfo = () => 
  useResumeStore((state) => state.educationInfo)

export const useExperienceInfo = () => 
  useResumeStore((state) => state.experienceInfo)

export const useSkillsInfo = () => 
  useResumeStore((state) => state.skillsInfo)

export const useActivitiesInfo = () => 
  useResumeStore((state) => state.activitiesInfo)

export const useProjectsInfo = () => 
  useResumeStore((state) => state.projectsInfo)

export const useCertificationsInfo = () => 
  useResumeStore((state) => state.certificationsInfo)

// Actions hook
export const useResumeActions = () => 
  useResumeStore((state) => ({
    updatePersonalInfo: state.updatePersonalInfo,
    updateEducationInfo: state.updateEducationInfo,
    updateExperienceInfo: state.updateExperienceInfo,
    updateSkillsInfo: state.updateSkillsInfo,
    updateActivitiesInfo: state.updateActivitiesInfo,
    updateProjectsInfo: state.updateProjectsInfo,
    updateCertificationsInfo: state.updateCertificationsInfo,
    clearFormData: state.clearFormData,
  }))