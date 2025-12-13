import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useHaptics } from "../hooks/use-haptics";
import { X } from "lucide-react";

interface BottomSheetContextValue {
  isOpen: boolean;
  open: (content: ReactNode, options?: BottomSheetOptions) => void;
  close: () => void;
}

interface BottomSheetOptions {
  title?: string;
  snapPoints?: number[];
  onClose?: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
}

interface BottomSheetProviderProps {
  children: ReactNode;
}

export function BottomSheetProvider({ children }: BottomSheetProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [options, setOptions] = useState<BottomSheetOptions>({});
  const [translateY, setTranslateY] = useState(0);
  const startY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { lightImpact } = useHaptics();

  const open = useCallback(
    (newContent: ReactNode, newOptions: BottomSheetOptions = {}) => {
      setContent(newContent);
      setOptions(newOptions);
      setIsOpen(true);
      setTranslateY(0);
      lightImpact();
    },
    [lightImpact]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    options.onClose?.();
    setTimeout(() => {
      setContent(null);
      setOptions({});
    }, 300);
  }, [options]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0) {
      setTranslateY(diff);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const threshold = 100;

    if (translateY > threshold) {
      close();
    } else {
      setTranslateY(0);
    }
  }, [translateY, close]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <BottomSheetContext.Provider value={{ isOpen, open, close }}>
      {children}

      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          transform: isOpen ? `translateY(${translateY}px)` : undefined,
          maxHeight: "85vh",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {options.title && (
          <div className="flex items-center justify-between px-4 pb-3 border-b">
            <h2 className="text-lg font-semibold">{options.title}</h2>
            <button onClick={close} className="p-2 -mr-2">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}

        <div className="overflow-auto max-h-[70vh] pb-safe">{content}</div>
      </div>
    </BottomSheetContext.Provider>
  );
}
