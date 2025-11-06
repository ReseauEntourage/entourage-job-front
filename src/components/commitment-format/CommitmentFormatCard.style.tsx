import styled from 'styled-components';

export const CardContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: stretch;
`;

export const CardImg = styled.div`
  width: 320px;
  min-width: 180px;
  aspect-ratio: 4/3;
  background: #eee;
  position: relative;
  display: flex;
  align-items: stretch;
  flex-shrink: 0;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    background: #eee;
    display: block;
  }
`;

export const CardContent = styled.div`
  padding: 20px 20px 16px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  h3 {
    font-weight: bold;
    margin: 0 0 8px 0;
  }
`;

export const CardInfos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0 8px 0;
  color: #666;
  font-size: 0.98rem;
`;

export const CardDesc = styled.div`
  color: #444;
  font-size: 1rem;
`;

export const CardPrice = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: #eaf6f3;
  color: #1a7f6b;
  font-weight: 700;
  border-radius: 20px;
  padding: 6px 18px;
  font-size: 1.1rem;
`;
