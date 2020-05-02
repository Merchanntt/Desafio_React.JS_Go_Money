const formatValue = (value: number): string => {
  const Real = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return Real;
};

export default formatValue;
