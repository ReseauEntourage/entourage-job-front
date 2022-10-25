import React from 'react';
import {
  // StyledDesktopContainer,
  // StyledMobileContainer,
  StyledContainer,
} from 'src/components/utils/containers/styles';
// import { plateform } from 'src/utils/Device';
import { PropTypes } from 'prop-types';

export const Container = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>;
};

Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

// const DesktopContainer = ({ children }) => {
//   return (
//     <StyledDesktopContainer>
//       <div className="content">{children}</div>
//     </StyledDesktopContainer>
//   );
// };

// const MobileContainer = ({ children }) => {
//   return (
//     <StyledMobileContainer>
//       <div className="content-mobile">{children}</div>
//     </StyledMobileContainer>
//   );
// };

// export const Container = plateform({
//   Desktop: DesktopContainer,
//   Mobile: MobileContainer,
// });
