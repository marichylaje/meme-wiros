// context/DesignContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

type DesignData = {
  templateName: string
  layerColors: string[]
}

type DesignContextType = {
  savedDesign: DesignData | null
  setSavedDesign: (data: DesignData) => void
}

const DesignContext = createContext<DesignContextType | undefined>(undefined)

export const DesignProvider = ({ children }: { children: ReactNode }) => {
  const [savedDesign, setSavedDesign] = useState<DesignData | null>(null)

  return (
    <DesignContext.Provider value={{ savedDesign, setSavedDesign }}>
      {children}
    </DesignContext.Provider>
  )
}

export const useDesign = () => {
  const context = useContext(DesignContext)
  if (!context) throw new Error('useDesign debe usarse dentro de DesignProvider')
  return context
}
