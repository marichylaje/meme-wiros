import ColorPicker from '../components/ColorPicker';
import FlagEditor from '../components/FlagEditor';
import Layout from '../components/Layout';
import { useColor } from '../context/ColorContext';

export default function Home() {
  const { color } = useColor();

  return (
    <Layout>
      <h1>Selector de Color</h1>
      <ColorPicker />

      <p style={{ marginTop: '2rem' }}>
        Color seleccionado:{' '}
        <span style={{ fontWeight: 'bold', color: color !== 'transparent' ? color : '#000' }}>
          {color}
        </span>
      </p>
      <h1>Editor de Banderas</h1>
      <FlagEditor />
    </Layout>
  );
}
