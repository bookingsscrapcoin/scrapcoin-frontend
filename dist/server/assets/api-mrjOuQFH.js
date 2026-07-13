const API_BASE = "http://localhost:4000";
async function parseJson(response) {
  if (!response.ok) {
    const body = await response.text();
    const message = body || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return response.json();
}
async function createBooking(payload, token) {
  return parseJson(
    await fetch(`${API_BASE}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...token ? { Authorization: `Bearer ${token}` } : {}
      },
      body: JSON.stringify(payload)
    })
  );
}
async function fetchCircularImpact() {
  return parseJson(await fetch(`${API_BASE}/api/live-pickup/impact`));
}
async function authFetch(url, token, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers || {},
    ...token ? { Authorization: `Bearer ${token}` } : {}
  };
  return parseJson(await fetch(url, { ...options, headers }));
}
async function fetchERPDashboard(token) {
  return authFetch(`${API_BASE}/api/erp/dashboard`, token);
}
async function fetchERPMaterials(token, category) {
  const url = `${API_BASE}/api/erp/materials`;
  return authFetch(url, token);
}
async function fetchERPMaterialPriceHistory(materialId, token) {
  return authFetch(`${API_BASE}/api/erp/materials/${materialId}/price-history`, token);
}
async function createERPMaterial(payload, token) {
  return authFetch(`${API_BASE}/api/erp/materials`, token, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
async function updateERPMaterial(materialId, payload, token) {
  return authFetch(`${API_BASE}/api/erp/materials/${materialId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
async function deleteERPMaterial(materialId, token) {
  return authFetch(`${API_BASE}/api/erp/materials/${materialId}`, token, {
    method: "DELETE"
  });
}
async function fetchERPSuppliers(token, search) {
  const url = search ? `${API_BASE}/api/erp/suppliers?search=${encodeURIComponent(search)}` : `${API_BASE}/api/erp/suppliers`;
  return authFetch(url, token);
}
async function fetchERPSupplierDetail(supplierId, token) {
  return authFetch(`${API_BASE}/api/erp/suppliers/${supplierId}`, token);
}
async function createERPSupplier(payload, token) {
  return authFetch(`${API_BASE}/api/erp/suppliers`, token, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
async function updateERPSupplier(supplierId, payload, token) {
  return authFetch(`${API_BASE}/api/erp/suppliers/${supplierId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
async function deleteERPSupplier(supplierId, token) {
  return authFetch(`${API_BASE}/api/erp/suppliers/${supplierId}`, token, {
    method: "DELETE"
  });
}
async function fetchERPCustomers(token, search) {
  const url = search ? `${API_BASE}/api/erp/customers?search=${encodeURIComponent(search)}` : `${API_BASE}/api/erp/customers`;
  return authFetch(url, token);
}
async function fetchERPCustomerDetail(customerId, token) {
  return authFetch(`${API_BASE}/api/erp/customers/${customerId}`, token);
}
async function createERPCustomer(payload, token) {
  return authFetch(`${API_BASE}/api/erp/customers`, token, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
async function updateERPCustomer(customerId, payload, token) {
  return authFetch(`${API_BASE}/api/erp/customers/${customerId}`, token, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
async function deleteERPCustomer(customerId, token) {
  return authFetch(`${API_BASE}/api/erp/customers/${customerId}`, token, {
    method: "DELETE"
  });
}
async function fetchERPTransactions(token, params = {}) {
  const q = new URLSearchParams(params).toString();
  return authFetch(`${API_BASE}/api/erp/transactions?${q}`, token);
}
async function createERPTransaction(payload, token) {
  return authFetch(`${API_BASE}/api/erp/transactions`, token, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
async function deleteERPTransaction(txnId, token) {
  return authFetch(`${API_BASE}/api/erp/transactions/${txnId}`, token, {
    method: "DELETE"
  });
}
async function fetchERPInvoices(token, params = {}) {
  const q = new URLSearchParams(params).toString();
  return authFetch(`${API_BASE}/api/erp/invoices?${q}`, token);
}
async function payERPInvoice(invoiceId, paymentMethod, notes, token) {
  return authFetch(`${API_BASE}/api/erp/invoices/${invoiceId}/pay`, token, {
    method: "PATCH",
    body: JSON.stringify({ payment_method: paymentMethod, notes })
  });
}
async function fetchERPPurchaseReceipts(token, customerId) {
  const url = `${API_BASE}/api/erp/purchase-receipts`;
  return authFetch(url, token);
}
async function createERPPurchaseReceipt(payload, token) {
  return authFetch(`${API_BASE}/api/erp/purchase-receipts`, token, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
async function deleteERPPurchaseReceipt(receiptId, token) {
  return authFetch(`${API_BASE}/api/erp/purchase-receipts/${receiptId}`, token, {
    method: "DELETE"
  });
}
async function sendERPWhatsApp(transactionId, token) {
  return authFetch(`${API_BASE}/api/erp/whatsapp/send/${transactionId}`, token, {
    method: "POST"
  });
}
async function fetchERPWhatsAppLogs(token) {
  return authFetch(`${API_BASE}/api/erp/whatsapp/logs`, token);
}
export {
  fetchCircularImpact as A,
  createBooking as B,
  fetchERPWhatsAppLogs as a,
  fetchERPMaterials as b,
  fetchERPSuppliers as c,
  fetchERPTransactions as d,
  deleteERPTransaction as e,
  fetchERPDashboard as f,
  createERPTransaction as g,
  fetchERPSupplierDetail as h,
  deleteERPSupplier as i,
  createERPSupplier as j,
  fetchERPCustomers as k,
  fetchERPPurchaseReceipts as l,
  deleteERPPurchaseReceipt as m,
  createERPPurchaseReceipt as n,
  fetchERPMaterialPriceHistory as o,
  deleteERPMaterial as p,
  updateERPMaterial as q,
  createERPMaterial as r,
  sendERPWhatsApp as s,
  fetchERPInvoices as t,
  updateERPSupplier as u,
  payERPInvoice as v,
  fetchERPCustomerDetail as w,
  deleteERPCustomer as x,
  updateERPCustomer as y,
  createERPCustomer as z
};
