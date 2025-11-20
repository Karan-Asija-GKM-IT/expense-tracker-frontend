
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES as LOCAL_CATEGORIES } from "../../constants/categories";
import "../../styles/style.css";

const AddTransactionModal = ({
  setShowAddTransaction,
  transactions = [],
  setTransactions,
  transactionToEdit = null, // optional: when provided, modal works in "edit" mode
  onDelete // optional callback invoked after delete
}) => {
  const isEdit = !!transactionToEdit;
  const firstRef = useRef(null);

  const [form, setForm] = useState({
    amount: "",
    category: (Array.isArray(LOCAL_CATEGORIES) && LOCAL_CATEGORIES[0]) || "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    type: "expense" // 'income' or 'expense'
  });

  const [categories, setCategories] = useState(LOCAL_CATEGORIES.map((name, idx) => ({ id: idx + 1, name })));

  // Prefill when transactionToEdit changes (retain previous values)
  useEffect(() => {
    // load categories from backend if available
    (async () => {
      try {
        const { default: api } = await import('../../utils/api');
        const res = await api.get('/categories');
        if (res?.data?.categories) setCategories(res.data.categories);
      } catch (err) {
        // fallback to local categories
      }
    })();
    

    if (isEdit) {
      const { amount, category, date, description, type } = transactionToEdit;
      // Ensure amount input shows absolute value for editing
      setForm({
        amount: amount != null ? Math.abs(Number(amount)).toString() : "",
        category: category ?? ((Array.isArray(LOCAL_CATEGORIES) && LOCAL_CATEGORIES[0]) ?? ""),
        date: date ?? new Date().toISOString().split("T")[0],
        description: description ?? "",
        type: type ?? (Number(amount) >= 0 ? "income" : "expense")
      });

      // focus first field
      setTimeout(() => firstRef.current && firstRef.current.focus(), 40);
    } else {
      // reset form when modal opened for add
      setForm({
        amount: "",
        category: (Array.isArray(LOCAL_CATEGORIES) && LOCAL_CATEGORIES[0]) || "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        type: "expense"
      });
      setTimeout(() => firstRef.current && firstRef.current.focus(), 40);
    }

    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setShowAddTransaction(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [transactionToEdit]); // eslint-disable-line

  const validate = () => {
    if (!form.amount || !form.category || !form.description) {
      alert("Please fill amount, category and description.");
      return false;
    }
    const parsed = parseFloat(form.amount);
    if (Number.isNaN(parsed) || parsed === 0) {
      alert("Please enter a valid non-zero amount.");
      return false;
    }
    return true;
  };

  const addOrSave = async (actionType) => {
    // actionType: 'income' | 'expense' | 'save'
    if (!validate()) return;

    const parsed = parseFloat(form.amount);
    const signType = actionType === "save" ? form.type : actionType;
    const signedAmount = signType === "expense" ? -Math.abs(parsed) : Math.abs(parsed);

    try {
      const { default: api } = await import('../../utils/api');
      if (isEdit) {
        const selectedCategory = categories.find(c => {
          const cname = (c.name || c.category_name || '').toString().trim().toLowerCase();
          const f = String(form.category).trim().toLowerCase();
          return String(c.id) === String(form.category) || cname === f;
        }) || categories[0];
         if (!selectedCategory) {
           alert('No categories available. Cannot save transaction.');
           return;
         }
        const res = await api.put(`/transactions/${transactionToEdit.id}`, {
            category_id: selectedCategory ? selectedCategory.id : null,
          amount: signedAmount,
          is_income: signType === 'income',
          description: form.description,
          date_of_transaction: form.date,
        });
        const updated = res.data;
        const norm = {
          id: updated.id,
          amount: Number(updated.amount),
          category: updated.category_name || updated.category || (selectedCategory && selectedCategory.name) || form.category || null,
          description: updated.description,
          date: updated.date_of_transaction || updated.date,
          type: updated.is_income ? 'income' : 'expense'
        };
        setTransactions(prev => prev.map(t => (t.id === norm.id ? norm : t)));
        setShowAddTransaction(false);
        return;
      }

      // create new transaction
      const selectedCategory = categories.find(c => {
        const cname = (c.name || c.category_name || '').toString().trim().toLowerCase();
        const f = String(form.category).trim().toLowerCase();
        return String(c.id) === String(form.category) || cname === f;
      }) || categories[0];
       if (!selectedCategory) {
         alert('No categories available. Cannot save transaction.');
         return;
       }
      const res = await api.post('/transactions', {
        category_id: selectedCategory ? selectedCategory.id : null,
        amount: signedAmount,
        is_income: signType === 'income',
        description: form.description,
        date_of_transaction: form.date,
      });

      const created = res.data;
      const norm = {
        id: created.id,
        amount: Number(created.amount),
        category: created.category_name || created.category || (selectedCategory && selectedCategory.name) || form.category || null,
        description: created.description,
        date: created.date_of_transaction || created.date,
        type: created.is_income ? 'income' : 'expense'
      };
      setTransactions(prev => [norm, ...prev]);
      setShowAddTransaction(false);
    } catch (err) {
      console.error('Failed to save transaction (API). Falling back to local update.', err);
      
      if (isEdit) {
        const norm = {
          id: transactionToEdit.id,
          amount: signedAmount,
          category: form.category,
          description: form.description,
          date: form.date,
          type: signType
        };
        setTransactions(prev => prev.map(t => (t.id === norm.id ? norm : t)));
        setShowAddTransaction(false);
        return;
      }

      // create local transaction
      const tx = {
        id: Date.now(),
        amount: signedAmount,
        category: form.category,
        description: form.description,
        date: form.date,
        type: signType
      };
      setTransactions(prev => [tx, ...prev]);
      setShowAddTransaction(false);
    }
  };

  const handleDelete = () => {
    const ok = window.confirm("Delete this transaction permanently?");
    if (!ok) return;
    (async () => {
      try {
        const { default: api } = await import('../../utils/api');
        await api.delete(`/transactions/${transactionToEdit.id}`);
        if (onDelete) {
          onDelete(transactionToEdit.id);
        } else {
          setTransactions(prev => prev.filter(t => t.id !== transactionToEdit.id));
        }
        setShowAddTransaction(false);
      } catch (err) {
        console.error('Failed to delete transaction (API). Falling back to local delete.', err);
        // fallback to local deletion
        if (onDelete) {
          onDelete(transactionToEdit.id);
        } else {
          setTransactions(prev => prev.filter(t => t.id !== transactionToEdit.id));
        }
        setShowAddTransaction(false);
      }
    })();
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowAddTransaction(false); }}>
      <div className="modal-panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 className="modal-title">{isEdit ? "Edit Transaction" : "Add Transaction"}</h3>
          </div>

          <button className="modal-close-btn" onClick={() => setShowAddTransaction(false)} aria-label="Close">
            <X size={18} />
          </button>
        </div>

            <div className="form-group-modern">
                <label>Amount</label>
          <input
            ref={firstRef}
            type="text" 
            className="input-modern"
      value={form.amount}
      onChange={(e) => {
        const value = e.target.value;
        // Allow only digits (0–9) and .
        if (/^\d*\.?\d*$/.test(value)) {
          const maxAmount = 100000;
          const numericValue = parseFloat(value) || 0;

        if (numericValue > maxAmount) {
          return;   // simply don't update the state
        }
          setForm({ ...form, amount: value });
        }
      }}
          placeholder="0.00"
      />
  </div>

        <div className="form-group-modern">
          <label>Category</label>
            <select
            className="form-select"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div className="form-group-modern">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className="form-group-modern">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Enter description"
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel-modern" onClick={() => setShowAddTransaction(false)}>Cancel</button>

          {isEdit ? (
            <>
              <button className="btn btn-expense btn-pill" style={{ marginRight: 8 }} onClick={handleDelete}>
                Delete
              </button>

              <button
                className="btn-income-modern"
                onClick={() => {
                  // Save uses current form.type (which was prefilled from transaction)
                  addOrSave("save");
                }}
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button className="btn-income-modern" onClick={() => addOrSave("income")}>＋ Income</button>
              <button className="btn-expense-modern" onClick={() => addOrSave("expense")}>− Expense</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
