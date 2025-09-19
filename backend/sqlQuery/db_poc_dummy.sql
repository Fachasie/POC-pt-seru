-- Membuat tabel baru untuk equipments (no_lambung)
CREATE TABLE equipments (
    id SERIAL PRIMARY KEY,
    no_lambung VARCHAR(50) UNIQUE NOT NULL,
    keterangan_equipment VARCHAR(255)
);

-- Membuat tabel baru untuk job_types (jenis_pekerjaan)
CREATE TABLE job_types (
    id SERIAL PRIMARY KEY,
    jenis_pekerjaan VARCHAR(100) UNIQUE NOT NULL
);

-- Membuat tabel job_order dengan foreign key
CREATE TABLE job_order (
    id SERIAL PRIMARY KEY,
    project_site VARCHAR(255),
    date_form DATE,
    hm INTEGER,
    km INTEGER,
    uraian_masalah TEXT,
    nama_operator VARCHAR(100),
    tanggal_masuk DATE,
    tanggal_keluar DATE,
    status_mutasi VARCHAR(50),
    status VARCHAR(50),
    equipment_id INTEGER REFERENCES equipments(id),
    job_type_id INTEGER REFERENCES job_types(id)
);

-- Memasukkan data ke dalam tabel equipments
INSERT INTO equipments (no_lambung, keterangan_equipment) VALUES
('DG031', 'Bulldozer Roda 4'),
('DX701', 'Motor Listrik Yamaha'),
('DF021', 'Truk Armada Estafet'),
('BT001', 'Bus Antar Jemput Krywn');

-- Memasukkan data ke dalam tabel job_types
INSERT INTO job_types (jenis_pekerjaan) VALUES
('Preventive Maintenance'),
('Repair'),
;

-- Memasukkan data ke dalam tabel job_order dengan menggunakan foreign key yang sesuai
INSERT INTO job_order (
    project_site,
    date_form,
    hm,
    km,
    uraian_masalah,
    nama_operator,
    tanggal_masuk,
    tanggal_keluar,
    status_mutasi,
    status,
    equipment_id,
    job_type_id
) VALUES
('Coba Baru', '2025-09-18', 200, 300, 'Dicoba saja', 'budi', '2025-09-18', '2025-09-19', 'no mutasi', 'Full Progress', 
(SELECT id FROM equipments WHERE no_lambung = 'DG031'),
(SELECT id FROM job_types WHERE jenis_pekerjaan = 'Preventive Maintenance')),

('Bekasi', '2025-09-13', 0, 100, 'Dicoba Jalan Kurang', 'Kiran', '2025-09-26', '2025-09-26', 'no mutasi', 'Full Progress', 
(SELECT id FROM equipments WHERE no_lambung = 'DX701'),
(SELECT id FROM job_types WHERE jenis_pekerjaan = 'Repair')),

('Mining Upas Bekasi', '2025-09-19', 0, 300, 'Ban Kurang Stabil', 'Yunus', '2025-09-06', '2025-09-26', 'no mutasi', 'Full Progress', 
(SELECT id FROM equipments WHERE no_lambung = 'DF021'),
(SELECT id FROM job_types WHERE jenis_pekerjaan = 'Repair'));