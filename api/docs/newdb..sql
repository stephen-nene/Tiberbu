CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE clinical_document_type AS ENUM ('lab_report', 'xray', 'prescription', 'report', 'image', 'other');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'cancelled', 'completed', 'in_progress');
CREATE TYPE week_day AS ENUM ('0', '1', '2', '3', '4', '5', '6');
CREATE TYPE user_role AS ENUM ('system_admin', 'clinician', 'patient', 'nurse', 'support');
CREATE TYPE user_status AS ENUM ('active', 'pending', 'suspended', 'archived');
CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE gender AS ENUM ('male', 'female', 'non_binary', 'undisclosed');

-- Specialization Table
CREATE TABLE specialization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    department VARCHAR(100),
    is_surgical BOOLEAN DEFAULT FALSE,
    is_primary_care BOOLEAN DEFAULT FALSE,
    icon VARCHAR(255),
    qualifications TEXT,
    average_consultation_fee DECIMAL(10,2),
    icd11_code VARCHAR(10),
    snomed_ct_id VARCHAR(10),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HealthcareUser Table
CREATE TABLE healthcare_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL DEFAULT 'patient',
    status user_status NOT NULL DEFAULT 'pending',
    blood_group blood_group,
    date_of_birth DATE,
    gender gender NOT NULL DEFAULT 'undisclosed',
    address JSONB,
    profile_image UUID,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    terms_accepted_at TIMESTAMP,
    privacy_policy_version VARCHAR(20),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    token VARCHAR(255),
    username VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(150),
    is_staff BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor Table
CREATE TABLE doctor (
    user_id UUID PRIMARY KEY REFERENCES healthcare_user(id) ON DELETE CASCADE,
    license_number VARCHAR(255) UNIQUE NOT NULL,
    medical_license VARCHAR(50) NOT NULL,
    license_jurisdiction VARCHAR(100) NOT NULL,
    certifications JSONB DEFAULT '{}',
    accepting_new_patients BOOLEAN DEFAULT TRUE,
    emergency_availability BOOLEAN DEFAULT FALSE,
    experience INTEGER,
    bio TEXT,
    rating DECIMAL(5,1),
    is_available BOOLEAN DEFAULT TRUE,
    fees INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Specialization Many-to-Many with Doctor
CREATE TABLE doctor_specialization (
    doctor_id UUID REFERENCES doctor(user_id) ON DELETE CASCADE,
    specialization_id UUID REFERENCES specialization(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, specialization_id)
);

-- Patient Table
CREATE TABLE patient (
    user_id UUID PRIMARY KEY REFERENCES healthcare_user(id) ON DELETE CASCADE,
    gender gender,
    medical_history TEXT,
    known_allergies JSONB DEFAULT '[]',
    permanent_medications JSONB DEFAULT '[]',
    emergency_contacts JSONB DEFAULT '[]',
    primary_insurance TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Availability Table
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctor(user_id) ON DELETE PROTECT,
    weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    override_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT end_time_after_start_time CHECK (end_time > start_time),
    UNIQUE (doctor_id, weekday, start_time, end_time)
);

-- Appointment Table
CREATE TABLE appointment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient(user_id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctor(user_id) ON DELETE SET NULL,
    scheduled_time TIMESTAMP NOT NULL CHECK (scheduled_time >= CURRENT_TIMESTAMP),
    is_admin_override BOOLEAN DEFAULT FALSE,
    status appointment_status NOT NULL DEFAULT 'scheduled',
    chief_complaint TEXT,
    notes TEXT,
    priority SMALLINT DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ClinicalAttachment Table
CREATE TABLE clinical_attachment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type_id INTEGER REFERENCES django_content_type(id) ON DELETE CASCADE,
    object_id UUID NOT NULL,
    file VARCHAR(255) NOT NULL,
    document_type clinical_document_type NOT NULL,
    caption VARCHAR(255),
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    access_audit JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ClinicalImage Table
CREATE TABLE clinical_image (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type_id INTEGER REFERENCES django_content_type(id) ON DELETE CASCADE,
    object_id UUID NOT NULL,
    image VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    clinical_context TEXT,
    sensitivity_level SMALLINT DEFAULT 2 CHECK (sensitivity_level BETWEEN 1 AND 3),
    access_log JSONB DEFAULT '[]'
);

-- Indexes
CREATE INDEX idx_specialization_display_order ON specialization(display_order, name);
CREATE INDEX idx_healthcare_user_email ON healthcare_user(email);
CREATE INDEX idx_healthcare_user_role ON healthcare_user(role);
CREATE INDEX idx_healthcare_user_status ON healthcare_user(status);
CREATE INDEX idx_appointment_scheduled_time ON appointment(scheduled_time, priority DESC);
CREATE INDEX idx_clinical_attachment ON clinical_attachment(content_type_id, object_id);
CREATE INDEX idx_clinical_image ON clinical_image(content_type_id, object_id);
