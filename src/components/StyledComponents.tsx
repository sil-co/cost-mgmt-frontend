import styled from "styled-components";

export const Shell = styled.div`
  display: grid; grid-template-rows: auto 1fr; min-height: 100vh;
`;

export const Header = styled.header`
  position: sticky; top: 0; z-index: 10;
  background: ${p => p.theme.panel};
  border-bottom: 1px solid ${p => p.theme.border};
  box-shadow: 0 10px 30px ${p => p.theme.shadow};
`;

export const HeaderInner = styled.div`
  max-width: 1100px; margin: 0 auto; padding: 14px 18px;
  display: flex; gap: 14px; align-items: center; justify-content: space-between;
`;

export const Title = styled.h1`
  font-size: 18px; margin: 0; font-weight: 700; letter-spacing: 0.4px;
`;

export const RightItem = styled.div`
  display: flex;

`;

export const MonthPickerWrap = styled.div`
  display: flex; gap: 8px; align-items: center;
`;

export const MonthInput = styled.input`
  background: ${p => p.theme.panelSoft}; color: ${p => p.theme.text};
  padding: 8px 10px; border-radius: 10px; border: 1px solid ${p => p.theme.border};
`;

export const Container = styled.main`
  max-width: 1100px; margin: 18px auto; padding: 0 18px 80px; width: 100%;
`;

export const Grid = styled.div`
  display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 16px;
  @media (max-width: 980px) { grid-template-columns: 1fr; }
`;

export const Card = styled.section`
  background: ${p => p.theme.panel}; border: 1px solid ${p => p.theme.border};
  border-radius: 16px; box-shadow: 0 10px 30px ${p => p.theme.shadow};
  margin-bottom: 18px;
`;

export const CardHeader = styled.div`
  padding: 14px 16px; border-bottom: 1px solid ${p => p.theme.border};
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
`;

export const CardTitle = styled.h2`
  font-size: 14px; margin: 0; color: ${p => p.theme.textDim}; font-weight: 600; text-transform: uppercase; letter-spacing: .6px;
`;

export const CardBody = styled.div`
  padding: 16px;
`;

export const Row = styled.div`
  display: grid; grid-template-columns: repeat(12, 1fr); gap: 10px; align-items: center;
`;

export const Button = styled.button<{ variant?: "primary" | "ghost" | "danger" }>`
  padding: 10px 12px; border-radius: 12px; border: 1px solid transparent; cursor: pointer;
  background: ${p => (p.variant === "primary" ? p.theme.primary : p.variant === "danger" ? p.theme.danger : p.theme.panelSoft)};
  color: ${p => (p.variant ? "#0c0c17" : p.theme.text)};
  border-color: ${p => (p.variant ? "transparent" : p.theme.border)};
  font-weight: 600; letter-spacing: .2px;
  transition: transform .04s ease, filter .2s ease;
  &:active { transform: translateY(1px); }
  &:hover { filter: brightness(1.05); }
`;

export const Input = styled.input`
  width: 100%; padding: 10px 12px; border-radius: 12px; border: 1px solid ${p => p.theme.border};
  background: ${p => p.theme.panelSoft}; color: ${p => p.theme.text};
`;

export const Select = styled.select`
  width: 100%; padding: 10px 12px; border-radius: 12px; border: 1px solid ${p => p.theme.border};
  background: ${p => p.theme.panelSoft}; color: ${p => p.theme.text};
`;

export const Text = styled.p`
  margin: 0; color: ${p => p.theme.textDim}; font-size: 13px;
`;

export const StatGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

export const Stat = styled.div`
  background: ${p => p.theme.panelSoft}; border: 1px solid ${p => p.theme.border};
  border-radius: 12px; padding: 12px; display: grid; gap: 6px;
`;

export const ProgressWrap = styled.div`
  height: 8px; background: #0b0d1a; border: 1px solid ${p => p.theme.border}; border-radius: 999px; overflow: hidden;
`;

export const ProgressBar = styled.div<{ ratio: number; color?: string }>`
  width: ${p => Math.min(100, Math.max(0, p.ratio * 100)).toFixed(1)}%;
  height: 100%; background: ${p => p.color || p.theme.primary}; transition: width .4s ease;
`;

export const Badge = styled.span<{ color?: string }>`
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px;
  background: ${p => p.color ? p.color + "22" : p.theme.panelSoft};
  border: 1px solid ${p => p.theme.border}; color: ${p => p.theme.text}; font-weight: 600; font-size: 12px;
`;

export const EmptyState = styled.div`
  text-align: center; padding: 20px; color: ${p => p.theme.textDim};
`;

export const BudgetInlineWrap = styled.div`
  display: inline-flex; gap: 8px; align-items: center;
`;

export const BudgetInput = styled(Input)`
  width: 110px;
`;
