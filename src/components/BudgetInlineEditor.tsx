import { useState, useEffect } from "react";
import * as SC from "./StyledComponents";

const BudgetInlineEditor: React.FC<{ initial: number; onSave: (val: number) => void; disabled?: boolean }> = ({ initial, onSave, disabled }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(initial ?? 0));

  useEffect(() => { setVal(String(initial ?? 0)); }, [initial]);

  if (!editing) {
    return (
      <SC.BudgetInlineWrap>
        <SC.Button onClick={() => setEditing(true)} disabled={disabled}>Edit Budget</SC.Button>
      </SC.BudgetInlineWrap>
    );
  }
  return (
    <SC.BudgetInlineWrap>
      <SC.BudgetInput type="number" inputMode="numeric" value={val} onChange={e => setVal(e.target.value)} />
      <SC.Button
        variant="primary"
        onClick={() => { onSave(Number(val || 0)); setEditing(false); }}
        disabled={disabled}
      >Save</SC.Button>
      <SC.Button onClick={() => { setVal(String(initial ?? 0)); setEditing(false); }} disabled={disabled}>Cancel</SC.Button>
    </SC.BudgetInlineWrap>
  );
};

export default BudgetInlineEditor;
