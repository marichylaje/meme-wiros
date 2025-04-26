import React, {
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle
  } from 'react';
  
  type ExportCanvasProps = {
    templateName: string;
    sides: number;
    layerColors: string[];
    texts: {
      id: string;
      text: string;
      color: string;
      fontFamily: string;
      fontSize: number;
      filled: boolean;
      strokeWidth: number;
      position: { x: number; y: number };
    }[];
    images: {
      id: string;
      src: string;
      position: { x: number; y: number };
      size: number;
      color: string;
    }[];
  };
  
  const WIDTH = 3300;
  const HEIGHT = 1900;
  const scaleFactor = WIDTH / 580;

  const ExportCanvas = forwardRef<HTMLCanvasElement, ExportCanvasProps>(
    ({ templateName, sides, layerColors, texts, images }, ref) => {
      const canvasRef = useRef<HTMLCanvasElement>(null);
      useImperativeHandle(ref, () => canvasRef.current!);
  
      useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
  
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
  
        const draw = async () => {
          // Capas coloreadas con máscara
          for (let i = 0; i <= sides; i++) {
            const color = layerColors[i];
            if (!color || color === 'transparent') continue;
  
            const maskUrl =
              i === sides
                ? `/templates/${templateName}/fullimg.png`
                : `/templates/${templateName}/img${i + 1}.png`;
  
            await drawMaskedImage(ctx, maskUrl, color, {
              x: 0,
              y: 0,
              width: WIDTH,
              height: HEIGHT
            });
          }

          const assetsResize = 3.7
  
          // Render imágenes coloreadas
          for (const img of images) {
            const size = img.size * assetsResize;
            console.log("IMG POSITION: ", img.position.y)
            console.log("IMG name: ", img.src)
            console.log({HEIGHT})
            console.log({size})
            console.log("POSITION: ", img.position.y * (HEIGHT))
            console.log("------------")
            const isHigherShield = img.src === "/shields/shield1.png"
            await drawMaskedImage(ctx, img.src, img.color, {
              x: img.position.x * (WIDTH + 50) - size / 2,
              y: (img.position.y * HEIGHT) - (size / 2) + (isHigherShield ? 150 : 0),
              //y: img.position.y * (HEIGHT + 125 + (isHigherShield ? -980 : -500))/* - size / 2 + size / (isHigherShield ? 15 : 9999)*/,
              width: size,
              height: size - (size / (isHigherShield ? 4 : 9999))
            });
          }
  
          // Render textos
          for (const t of texts) {
            const x = t.position.x * (WIDTH + 50);
            const y = t.position.y * (HEIGHT + 25);
            const fontSize = t.fontSize * (assetsResize - .1);
          
            ctx.save();
            ctx.font = `${t.filled ? 'bold' : ''} ${fontSize}px ${t.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = t.color;
          
            // Escalar el borde proporcional al canvas HD
            ctx.lineWidth = t.strokeWidth * scaleFactor;
          
            if (!t.filled && t.strokeWidth > 0) {
              ctx.strokeStyle = 'black';
              ctx.strokeText(t.text, x, y);
            }
          
            ctx.fillText(t.text, x, y);
            ctx.restore();
          }
        };
  
        draw();
      }, [templateName, sides, layerColors, texts, images]);
  
      return <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ display: 'none' }} />;
    }
  );
  
  export default ExportCanvas;
  
  // 🎨 Función que tiñe la imagen blanca (máscara) con un color sólido
  async function drawMaskedImage(
    ctx: CanvasRenderingContext2D,
    maskUrl: string,
    fillColor: string,
    opts: { x: number; y: number; width: number; height: number }
  ) {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = maskUrl;
  
      img.onload = () => {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = opts.width;
        offCanvas.height = opts.height;
        const offCtx = offCanvas.getContext('2d');
        if (!offCtx) return resolve();
  
        offCtx.drawImage(img, 0, 0, opts.width, opts.height);
  
        const imageData = offCtx.getImageData(0, 0, opts.width, opts.height);
        const data = imageData.data;
        const rgb = hexToRgb(fillColor);
  
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha > 10) {
            data[i] = rgb.r;
            data[i + 1] = rgb.g;
            data[i + 2] = rgb.b;
            data[i + 3] = alpha;
          }
        }
  
        offCtx.putImageData(imageData, 0, 0);
        ctx.drawImage(offCanvas, opts.x, opts.y, opts.width, opts.height);
  
        resolve();
      };
  
      img.onerror = () => resolve();
    });
  }
  
  function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const parsed = hex.replace('#', '');
    const bigint = parseInt(parsed, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }
  