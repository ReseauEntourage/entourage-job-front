import styled, { css, keyframes } from 'styled-components';

const CARD_W = 48;
const CARD_H = 56;
const GRID_GAP = 8;
const LENS_SIZE = 36;
const CYCLE = 4;

const lx = (col: number) =>
  col * (CARD_W + GRID_GAP) + Math.round((CARD_W - LENS_SIZE) / 2);
const ly = (row: number) =>
  row * (CARD_H + GRID_GAP) + Math.round((CARD_H - LENS_SIZE) / 2);

const lensMove = keyframes`
  0%    { transform: translate(${lx(0)}px, ${ly(0)}px); }
  12.5% { transform: translate(${lx(1)}px, ${ly(0)}px); }
  25%   { transform: translate(${lx(2)}px, ${ly(0)}px); }
  37.5% { transform: translate(${lx(3)}px, ${ly(0)}px); }
  50%   { transform: translate(${lx(0)}px, ${ly(1)}px); }
  62.5% { transform: translate(${lx(1)}px, ${ly(1)}px); }
  75%   { transform: translate(${lx(2)}px, ${ly(1)}px); }
  87.5% { transform: translate(${lx(3)}px, ${ly(1)}px); }
  100%  { transform: translate(${lx(0)}px, ${ly(0)}px); }
`;

const cardFlash = keyframes`
  0% {
    background: rgba(71, 168, 185, 0.45);
    color: rgba(255, 255, 255, 0.95);
    border-color: rgba(71, 168, 185, 0.65);
    box-shadow: 0 0 10px rgba(71, 168, 185, 0.3);
  }
  10% {
    background: rgba(71, 168, 185, 0.3);
    color: rgba(255, 255, 255, 0.85);
    border-color: rgba(71, 168, 185, 0.4);
  }
  18% {
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
  100% {
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
`;

const matrixFlicker = keyframes`
  0%, 80%, 100% { opacity: 1; }
  83%  { opacity: 0.35; }
  86%  { opacity: 0.75; }
  89%  { opacity: 0.2; }
  92%  { opacity: 0.6; }
  95%  { opacity: 0.85; }
`;

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
`;

export const StyledCardGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, ${CARD_W}px);
  grid-template-rows: repeat(2, ${CARD_H}px);
  gap: ${GRID_GAP}px;
`;

export const StyledCard = styled.div<{ $delay: number; $hasFlicker: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.22);
  ${({ $delay, $hasFlicker }) =>
    $hasFlicker
      ? css`
          animation: ${cardFlash} ${CYCLE}s linear ${$delay}s infinite,
            ${matrixFlicker} 3.1s ease-in-out ${$delay + 0.8}s infinite;
        `
      : css`
          animation: ${cardFlash} ${CYCLE}s linear ${$delay}s infinite;
        `}
`;

export const StyledLens = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${LENS_SIZE}px;
  height: ${LENS_SIZE}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(71, 168, 185, 0.25);
  border: 1.5px solid rgba(71, 168, 185, 0.55);
  pointer-events: none;
  animation: ${lensMove} ${CYCLE}s steps(8, end) infinite;
`;

export const StyledTitles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
`;

export const StyledTitle = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

export const StyledSubtitle = styled.p`
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
`;
