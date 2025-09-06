import { useState } from "react";
import type { CategoryProps } from "../types/types";
import styled from "styled-components";
import { theme } from "../theme";

// const Card = styled.section`
// background: ${p => p.theme.panel}; border: 1px solid ${p => p.theme.border};
// border-radius: 16px; padding: 16px; margin-bottom: 16px;
// `;

const Card = styled.section`
  background: ${p => p.theme.panel}; border: 1px solid ${p => p.theme.border};
  border-radius: 16px; box-shadow: 0 10px 30px ${p => p.theme.shadow};
  margin-bottom: 18px;
`;

const CardHeader = styled.div`
  padding: 14px 16px; border-bottom: 1px solid ${p => p.theme.border};
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
`;

const CardTitle = styled.h2`
  font-size: 14px; margin: 0; color: ${p => p.theme.textDim}; font-weight: 600; text-transform: uppercase; letter-spacing: .6px;
`;

const FormContainer = styled.form`
  display: flex;
  justify-content: space-around;
`;

const InputContainer = styled.div`
  margin: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Row = styled.div`
  display: grid; grid-template-columns: repeat(12, 1fr); gap: 10px; align-items: center;
`;

const Button = styled.button`
  padding: 10px 12px; border-radius: 12px; border: 1px solid transparent; cursor: pointer;
  margin-right: 20px;
  background: ${p => p.theme.primary};
  color: #0c0c17;
  border-color: transparent;
  font-weight: 600; letter-spacing: .2px;
  transition: transform .04s ease, filter .2s ease;
  &:active { transform: translateY(1px); }
  &:hover { filter: brightness(1.05); }
`;

const Input = styled.input`
  width: 100%; padding: 10px 12px; border-radius: 12px; border: 1px solid ${p => p.theme.border};
  margin: 0 10px;
  background: ${p => p.theme.panelSoft}; color: ${p => p.theme.text};
`;

const Text = styled.p`
color: ${p => p.theme.textDim};
`;

const CategoryManager: React.FC<CategoryProps> = ({
    categories,
    handleAdd
}) => {
    const [form, setForm] = useState({ name: "", color: "#1d213e" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log(form);
        try {
            setLoading(true);
            await handleAdd(form);
            setForm({ name: "", color: "#1d213e" });
        } catch (e: any) {
            setError(e?.message || "Failed to add category");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Categories</CardTitle>
            </CardHeader>
            {error && <Text style={{ color: theme.danger }}>Error: {error}</Text>}
            <FormContainer onSubmit={onSubmit}>
                <InputContainer>
                    <Input
                        placeholder="Category name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                        style={{ borderColor: form.color, backgroundColor: form.color }}
                    />
                    <Input
                        type="color"
                        value={form.color}
                        onChange={e => setForm({ ...form, color: e.target.value })}
                        placeholder="Color"
                    />
                </InputContainer>
                <Row>
                    <div style={{ gridColumn: "span 12", display: "flex", justifyContent: "flex-end" }}>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Category"}
                        </Button>
                    </div>
                </Row>
            </FormContainer>
        </Card>
    );
};

export default CategoryManager;
