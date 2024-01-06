import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import ToolBar from '../../../ToolBar';
import * as S from './RootLayout.styled';

const RootLayout = (props) => {
  const { navigation: Navigation, pageTemplate: PageTemplate } = props;

  return (
    <S.Background>
      {Navigation && (
        <S.NavigationContainer>
          <Navigation />
        </S.NavigationContainer>
      )}
      <S.PageContainer>
        <PageTemplate>
          <Outlet />
        </PageTemplate>
      </S.PageContainer>
      <ToolBar />
    </S.Background>
  );
};
export default RootLayout;

RootLayout.propTypes = {
  navigation: PropTypes.elementType,
  pageTemplate: PropTypes.elementType,
};
