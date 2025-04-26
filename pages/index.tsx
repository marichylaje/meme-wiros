import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import TemplatesList from '../components/TemplatesList'
import PreviewSection from '../components/PreviewSection'
import FlagEditor from '../components/FlagEditor'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useDesign } from '../context/DesignContext'
import Button from '../components/ui/Button'
import { capitalizeFirstLetter } from '../utils/capitalize'

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #1f2937;
`

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1280px;
  margin: auto;
`

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  color: #f9fafb;
  overflow: hidden;
  margin-top: 50px;
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: auto;
  margin-top: 50px;
`

const SidebarRight = styled.div`
  width: 300px;
  padding: 1rem;
  background-color: #111827;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

const FloatingSaveButton = styled(Button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 12;
  background-color: #10B981;
  color: white;
  padding: 1.2rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
    background-color: #059669;
  }

  &:active {
    transform: scale(0.98);
  }
`

type TextElement = {
  id: string;
  text: string;
  fontFamily: string;
  color: string;
  fontSize: number;
  filled: boolean;
  strokeWidth: number;
  position: { x: number; y: number };
}

type ImageElement = {
  id: string;
  src: string;
  position: { x: number; y: number };
  size: number;
  color: string;
}

const STORAGE_KEY = 'templateColors'

const HomePage = () => {
  const { user, isAuthenticated } = useAuth()
  const { setSavedDesign } = useDesign()

  const [templates, setTemplates] = useState<{ name: string; preview: string; sides: number }[]>([])
  const [currentTemplateName, setCurrentTemplateName] = useState('')
  const [currentSides, setCurrentSides] = useState(0)

  const [templateColors, setTemplateColors] = useState<Record<string, string[]>>({})
  const [layerColors, setLayerColors] = useState<string[]>([])


  const [texts, setTexts] = useState<TextElement[]>([])
  const [images, setImages] = useState<ImageElement[]>([])

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  const loadStoredColors = () => {
    if (typeof window === 'undefined') return {}
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  }

  const storeColors = (colors: Record<string, string[]>) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors))
  }

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await fetch('/api/templates')
      const data = await res.json()

      const templatesWithPreviews = data.map((t: any) => ({
        ...t,
        preview: `/templates/${capitalizeFirstLetter(t.name)}/example.png`,
      }))

      setTemplates(templatesWithPreviews)

      const storedColors = loadStoredColors()
      setTemplateColors(storedColors)

      const initial = templatesWithPreviews[0]
      if (initial) {
        setCurrentTemplateName(capitalizeFirstLetter(initial.name))
        setCurrentSides(initial.sides)

        const existing = storedColors[capitalizeFirstLetter(initial.name)] || []
        const missingCount = initial.sides + 1 - existing.length
        const extraColors = missingCount > 0
          ? Array.from({ length: missingCount }, generateRandomColor)
          : []

        const finalColors = [...existing, ...extraColors]
        const updatedColors = { ...storedColors, [capitalizeFirstLetter(initial.name)]: finalColors }

        setTemplateColors(updatedColors)
        setLayerColors(finalColors.slice(0, initial.sides + 1))
        storeColors(updatedColors)
      }
    }

    fetchTemplates()
  }, [])

  const handleTemplateChange = (templateName: string) => {
    const selected = templates.find((t) => capitalizeFirstLetter(t.name) === capitalizeFirstLetter(templateName))
    if (!selected) return

    setCurrentTemplateName(selected.name)
    setCurrentSides(selected.sides)

    const existing = templateColors[capitalizeFirstLetter(templateName)] || []
    const missingCount = selected.sides + 1 - existing.length
    const extraColors = missingCount > 0
      ? Array.from({ length: missingCount }, generateRandomColor)
      : []

    const finalColors = [...existing, ...extraColors]
    const updated = { ...templateColors, [capitalizeFirstLetter(templateName)]: finalColors }

    setTemplateColors(updated)
    setLayerColors(finalColors.slice(0, selected.sides + 1))
    storeColors(updated)
  }

  const handleSubmitDesign = async () => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Debes iniciar sesión para guardar el diseño.')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Token no encontrado.')
      return
    }

    try {
      const res = await fetch('/api/design/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateName: capitalizeFirstLetter(currentTemplateName),
          layerColors,
          texts,
          images
        })
      })

      if (res.ok) {
        toast.success('Diseño guardado con éxito')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al guardar el diseño')
      }
    } catch (err) {
      toast.error('Error de conexión al servidor')
    }
  }

  const handleLoadSavedDesign = async () => {
    const token = localStorage.getItem('token')
    if (!token) return toast.error('Token no encontrado')

    try {
      const res = await fetch('/api/design/get', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('No se encontró diseño')

      const data = await res.json()

      setCurrentTemplateName(capitalizeFirstLetter(data.templateName))
      const template = templates.find(t => capitalizeFirstLetter(t.name) === capitalizeFirstLetter(data.templateName))
      if (template) setCurrentSides(template.sides)

      setLayerColors(JSON.parse(data.layerColors))
      setTexts(data.texts || []);
      setImages(data.images || []);
      
      setSavedDesign({
        templateName: capitalizeFirstLetter(data.templateName),
        layerColors: JSON.parse(data.layerColors),
      })

      toast.success('Diseño cargado con éxito')
    } catch (err) {
      toast.error('No se pudo cargar el diseño')
    }
  }

  return (
    <PageWrapper>
      <AppWrapper>
        <Navbar />
        <MainContainer>
          <Content>
            <FlagEditor
              templateName={capitalizeFirstLetter(currentTemplateName)}
              sides={currentSides}
              layerColors={layerColors}
              setLayerColors={setLayerColors}
              handleLoadSavedDesign={handleLoadSavedDesign}
              texts={texts}
              setTexts={setTexts}
              images={images}
              setImages={setImages}
            />

            <FloatingSaveButton onClick={handleSubmitDesign}>
              GUARDAR DISEÑO
            </FloatingSaveButton>

            <PreviewSection
              templateName={capitalizeFirstLetter(currentTemplateName)}
              texts={texts}
              images={images}
              layerColors={layerColors} // 👈 nuevo prop
            />
          </Content>

          <SidebarRight>
            <TemplatesList
              templates={templates}
              currentTemplate={currentTemplateName}
              onTemplateChange={handleTemplateChange}
            />
          </SidebarRight>
        </MainContainer>
      </AppWrapper>
    </PageWrapper>
  )
}

export default HomePage
