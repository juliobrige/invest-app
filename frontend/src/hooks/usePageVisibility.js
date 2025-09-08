import { useState, useEffect } from 'react';

/**
 * Este hook personalizado deteta se a página da aplicação
 * está atualmente visível para o utilizador.
 * @returns {boolean} - true se a página estiver visível, false caso contrário.
 */
function usePageVisibility() {
  // document.hidden é uma propriedade do navegador que nos diz se a página está visível
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => setIsVisible(!document.hidden);

    // Adiciona um "ouvinte" ao navegador. Sempre que o utilizador
    // muda de separador, esta função será chamada.
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Quando o componente que usa este hook é "desmontado",
    // removemos o "ouvinte" para evitar problemas de memória.
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

export default usePageVisibility;