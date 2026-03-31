# Provenance

**Provenance** is a deterministic compliance engine that converts operational and finance data into regulator-ready reports with full traceability, reproducible calculations, and audit-grade provenance.

The system prioritizes:

* Correctness over convenience
* Transparency over abstraction
* Deterministic computation over heuristics
* Audit readiness over dashboards

Provenance transforms raw enterprise records into standardized compliance outputs without requiring external integrations or SaaS dependencies.

---

# Core Thesis

Enterprise compliance reporting today is:

* Spreadsheet-heavy
* Consultant-dependent
* Opaque in calculation logic
* Difficult to audit

Provenance replaces manual workflows with:

* Deterministic calculations
* Versioned emission factors
* Structured provenance logs
* Regulator-aligned exports

Every reported number can be traced to:

KPI → Input Row → Emission Factor → Formula Version

No black boxes.

---

# Regulatory Alignment

Provenance is designed to align with Indian regulatory frameworks, including:

* Securities and Exchange Board of India — BRSR Core assurance requirements
* Bureau of Energy Efficiency — Carbon Credit Trading Scheme (CCTS) direction
* Central Pollution Control Board — Plastic EPR filing schema

The system focuses on structural alignment with these frameworks rather than submission automation.

---

# What Provenance Does

Provenance ingests enterprise exports such as:

* GST purchase registers
* Utility consumption records
* Fuel purchase logs
* Production output data
* SKU-level packaging data

It produces:

1. BRSR Core-aligned KPI tables
2. Scope 1 and Scope 2 emissions
3. Scope 3 proxy emissions (purchased goods)
4. Product-level Carbon BOM
5. Emissions intensity metrics
6. Plastic EPR draft CSV outputs
7. Assurance-ready provenance logs

All outputs are reproducible and version-controlled.

---

# System Architecture

## Design Principles

* Deterministic computation
* No external API dependencies
* Local-first execution
* Explicit factor versioning
* Structured audit trace

---

## High-Level Components

### Frontend

* Streamlit (MVP)
* Optional Next.js (production interface)

### Backend

* FastAPI

### Database

* DuckDB (analytical MVP)
* Postgres (scalable deployment)

---

## Core Data Model

```
raw_invoices
raw_utilities
raw_shipments

normalized_lines
factor_library
factor_provenance

kpi_results
kpi_trace
epr_obligations
```

---

## Critical: KPI Trace Table

```
kpi_id
input_row_id
factor_id
formula_version
timestamp
```

This table enables:

* KPI → Invoice traceability
* Factor auditability
* Formula reproducibility
* Version comparison

This is the foundation of audit defensibility.

---

# Core Computation Model

## Unit Normalization

All quantities converted to base units:

* kWh
* kL
* kg
* L

Explicit conversion table maintained.

---

## Scope 2 — Electricity

```
tCO2e = Σ electricity_kWh × factor_kg_per_kWh / 1000
```

---

## Scope 1 — Fuel

```
tCO2e = quantity × factor_kg_per_unit / 1000
```

---

## Scope 3 Proxy — Purchased Goods (Carbon BOM)

Per purchase line:

```
co2e_line_kg = qty_standardized × material_factor
```

Optional transport:

```
transport_kg = distance_km × weight_kg × factor_kg_per_tkm / 1000
```

Aggregations available by:

* product
* supplier
* plant
* company

---

## Intensity

```
GHG_intensity = total_tCO2e / output_qty
```

Units explicitly labeled in output.

---

## Plastic EPR

```
plastic_total_kg = sales_units × grams_per_unit / 1000
obligation = plastic_total_kg × obligation_rate
```

Exports CPCB-aligned schema.

---

# What Provenance Does Not Claim

* Full lifecycle assessment (LCA)
* Verified carbon certification
* Automated regulator submission
* Complete Scope 3 coverage

It provides structured, traceable, proxy-based compliance computation.

---

# Project Resources

## Problem Statement & Design Docs

Notion (Hackathon Design Documentation)
[https://www.notion.so/hackathon-257a0ebae6ec800799bffad380063f2d](https://www.notion.so/hackathon-257a0ebae6ec800799bffad380063f2d)

---

## AI Design & Reasoning Log

ChatGPT Design Session
[https://chatgpt.com/c/6967c557-c610-8322-beeb-e68d5bd7f4a2](https://chatgpt.com/c/6967c557-c610-8322-beeb-e68d5bd7f4a2)

---

## BRSR Regulatory RAG Reference Tooling

GitHub Repository
[https://github.com/About-Rudra/BRSR-RAG](https://github.com/About-Rudra/BRSR-RAG)

---

# Current Status

In active development.

Primary focus areas:

* Core computation engine
* Deterministic factor mapping
* Provenance logging
* Export workflows (CSV + PDF)

UI polish and advanced analytics are secondary to computational correctness.

---

# Why Provenance Matters

Compliance numbers without traceability are liabilities.
Compliance numbers with structured provenance are defensible.

Provenance is designed to make every reported value:

* Reproducible
* Transparent
* Auditable
* Regulator-aligned
