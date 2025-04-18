import { useState, useEffect } from 'react';
import CreditLineTable from '@/components/CreditLineTable';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [creditLines, setCreditLines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreditLines = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://127.0.0.1:80/api/credit-lines?paginate=true');
        if (!response.ok) {
          throw new Error('No se pudo cargar los datos');
        }
        const data = await response.json();
        if (data.success && data.data && data.data.data) {
          setCreditLines(data.data.data);
        } else {
          setCreditLines([]);
        }
      } catch (err) {
        console.error('Error al cargar líneas de crédito:', err);
        setError('Error al cargar los datos. Por favor, intente nuevamente más tarde.');
        toast({
          title: "Error de carga",
          description: "No se pudieron cargar las líneas de crédito",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreditLines();
  }, [toast]);

  const handleCreateNew = () => {
    toast({
      title: "Crear nueva línea",
      description: "Funcionalidad de crear nueva línea de crédito"
    });
  };

  const handleIncreaseLimit = (id) => {
    toast({
      title: "Aumentar cupo",
      description: `Aumentar cupo para línea de crédito ${id}`
    });
  };

  const handleViewDetails = (id) => {
    toast({
      title: "Ver detalles",
      description: `Ver detalles de línea de crédito ${id}`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Cargando líneas de crédito...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-5">{error}</div>
      ) : (
        <CreditLineTable 
          creditLines={creditLines}
          onCreateNew={handleCreateNew}
          onIncreaseLimit={handleIncreaseLimit}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
};

export default Index;
