import { useState } from "react";
import type { CategoryProps } from "../types/types";
import { theme } from "../theme";
import * as SC from "./StyledComponents";

const CategoryManager: React.FC<CategoryProps> = ({
    handleAdd
}) => {
    const [form, setForm] = useState<{ name: string; color: string; budget: string }>({ name: "", color: "#1d213e", budget: "10000" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            await handleAdd(form);
            setForm({ name: "", color: "#1d213e", budget: "10000" });
        } catch (e: any) {
            setError(e?.message || "Failed to add category");
        } finally {
            setLoading(false);
        }
    }

    return (
        <SC.Card>
            <SC.CardHeader>
                <SC.CardTitle>Categories</SC.CardTitle>
            </SC.CardHeader>
            {error && <SC.Text style={{ color: theme.danger }}>Error: {error}</SC.Text>}
            <SC.CardBody>
                <form onSubmit={onSubmit}>
                    <SC.Row style={{ marginBottom: 10 }}>
                        <div style={{ gridColumn: "span 4" }}>
                            <SC.Text>Name</SC.Text>
                            <SC.Input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ gridColumn: "span 4" }}>
                            <SC.Text>Budget</SC.Text>
                            <SC.Input
                                type="number"
                                step="1"
                                inputMode="numeric"
                                placeholder="0"
                                value={form.budget}
                                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ gridColumn: "span 4" }}>
                            <SC.Text>Color</SC.Text>
                            <SC.Input
                                type="color"
                                value={form.color}
                                onChange={(e) => setForm({ ...form, color: e.target.value })}
                                required
                                style={{ borderColor: form.color, backgroundColor: form.color }}
                            />
                        </div>
                    </SC.Row>
                    <SC.Row>
                        <div style={{ gridColumn: "span 12", display: "flex", justifyContent: "flex-end" }}>
                            <SC.Button type="submit" variant="primary" disabled={loading}>
                                {loading ? "Saving..." : "Add Category"}
                            </SC.Button>
                        </div>
                    </SC.Row>
                </form>
            </SC.CardBody>
        </SC.Card>
        // <Card>
        //     <CardHeader>
        //         <CardTitle>Categories</CardTitle>
        //     </CardHeader>
        //     {error && <SC.Text style={{ color: theme.danger }}>Error: {error}</Text>}
        //     <FormContainer onSubmit={onSubmit}>
        //         <InputContainer>
        //             <Input
        //                 placeholder="Category name"
        //                 value={form.name}
        //                 onChange={e => setForm({ ...form, name: e.target.value })}
        //                 required
        //                 style={{ borderColor: form.color, backgroundColor: form.color }}
        //             />
        //             <Input
        //                 type="color"
        //                 value={form.color}
        //                 onChange={e => setForm({ ...form, color: e.target.value })}
        //                 placeholder="Color"
        //             />
        //         </InputContainer>
        //         <Row>
        //             <div style={{ gridColumn: "span 12", display: "flex", justifyContent: "flex-end" }}>
        //                 <Button type="submit" disabled={loading}>
        //                     {loading ? "Adding..." : "Add Category"}
        //                 </Button>
        //             </div>
        //         </Row>
        //     </FormContainer>
        // </Card>
    );
};

export default CategoryManager;
