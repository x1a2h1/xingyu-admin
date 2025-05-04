import { Navigate } from 'react-router-dom';

const Index = () => {
  return (
    <Navigate
      replace
      to={import.meta.env.VITE_ROUTE_HOME}
    />
  );
};

export const handle = {
  constant: true,
  hideInMenu: true,
  i18nKey: 'route.index',
  title: 'index'
};

export default Index;
