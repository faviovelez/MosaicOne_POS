--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.10
-- Dumped by pg_dump version 9.5.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: bank_balances; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE bank_balances (
    id integer NOT NULL,
    balance double precision,
    store_id integer,
    business_unit_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE bank_balances OWNER TO faviovelez;

--
-- Name: bank_balances_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE bank_balances_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bank_balances_id_seq OWNER TO faviovelez;

--
-- Name: bank_balances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE bank_balances_id_seq OWNED BY bank_balances.id;


--
-- Name: banks; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE banks (
    id integer NOT NULL,
    name character varying,
    rfc character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    pos boolean DEFAULT false,
    web boolean DEFAULT true,
    date date
);


ALTER TABLE banks OWNER TO faviovelez;

--
-- Name: banks_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE banks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE banks_id_seq OWNER TO faviovelez;

--
-- Name: banks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE banks_id_seq OWNED BY banks.id;


--
-- Name: bill_receiveds; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE bill_receiveds (
    id integer NOT NULL,
    folio character varying,
    date_of_bill date,
    subtotal double precision,
    taxes_rate double precision,
    taxes double precision,
    total_amount double precision,
    supplier_id integer,
    product_id integer,
    payment_day date,
    payment_complete boolean,
    payment_on_time boolean,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    business_unit_id integer,
    store_id integer
);


ALTER TABLE bill_receiveds OWNER TO faviovelez;

--
-- Name: bill_receiveds_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE bill_receiveds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bill_receiveds_id_seq OWNER TO faviovelez;

--
-- Name: bill_receiveds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE bill_receiveds_id_seq OWNED BY bill_receiveds.id;


--
-- Name: bill_sales; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE bill_sales (
    id integer NOT NULL,
    business_unit_id integer,
    store_id integer,
    sales_quantity integer,
    amount double precision,
    month integer,
    year integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    discount double precision
);


ALTER TABLE bill_sales OWNER TO faviovelez;

--
-- Name: bill_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE bill_sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bill_sales_id_seq OWNER TO faviovelez;

--
-- Name: bill_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE bill_sales_id_seq OWNED BY bill_sales.id;


--
-- Name: billing_addresses; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE billing_addresses (
    id integer NOT NULL,
    type_of_person character varying,
    business_name character varying,
    rfc character varying,
    street character varying,
    exterior_number character varying,
    interior_number character varying,
    zipcode integer,
    neighborhood character varying,
    city character varying,
    state character varying,
    country character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    tax_regime_id integer,
    pos boolean DEFAULT false,
    web boolean DEFAULT true,
    date date
);


ALTER TABLE billing_addresses OWNER TO faviovelez;

--
-- Name: billing_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE billing_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE billing_addresses_id_seq OWNER TO faviovelez;

--
-- Name: billing_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE billing_addresses_id_seq OWNED BY billing_addresses.id;


--
-- Name: bills; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE bills (
    id integer NOT NULL,
    status character varying,
    discount_applied double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    prospect_id integer,
    pdf character varying,
    xml character varying,
    issuing_company_id integer,
    receiving_company_id integer,
    store_id integer,
    sequence character varying,
    folio character varying,
    payment_method_id integer,
    payment_form_id integer,
    tax_regime_id integer,
    cfdi_use_id integer,
    tax_id integer,
    pac_id integer,
    relation_type_id integer,
    references_field character varying,
    type_of_bill_id integer,
    currency_id integer,
    id_trib_reg_num character varying,
    confirmation_key character varying,
    exchange_rate double precision,
    country_id integer,
    automatic_discount_applied double precision,
    manual_discount_applied double precision,
    taxes_transferred double precision,
    taxes_witheld double precision,
    sat_certificate_number character varying,
    certificate_number character varying,
    qr_string character varying,
    original_chain text,
    digital_stamp text,
    subtotal double precision,
    total double precision,
    sat_zipcode_id integer,
    date_signed timestamp without time zone,
    leyend character varying,
    uuid character varying,
    taxes double precision,
    payed boolean DEFAULT false,
    parent_id integer,
    sat_stamp character varying,
    payment_conditions character varying,
    "from" character varying,
    cancel_receipt character varying,
    bill_type character varying
);


ALTER TABLE bills OWNER TO faviovelez;

--
-- Name: bills_children; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE bills_children (
    id integer NOT NULL,
    bill_id integer,
    children_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE bills_children OWNER TO faviovelez;

--
-- Name: bills_children_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE bills_children_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bills_children_id_seq OWNER TO faviovelez;

--
-- Name: bills_children_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE bills_children_id_seq OWNED BY bills_children.id;


--
-- Name: bills_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE bills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bills_id_seq OWNER TO faviovelez;

--
-- Name: bills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE bills_id_seq OWNED BY bills.id;


--
-- Name: business_group_sales; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE business_group_sales (
    id integer NOT NULL,
    business_group_id integer,
    month integer,
    year integer,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    discount double precision,
    total double precision,
    subtotal double precision,
    taxes double precision,
    quantity integer
);


ALTER TABLE business_group_sales OWNER TO faviovelez;

--
-- Name: business_group_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE business_group_sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE business_group_sales_id_seq OWNER TO faviovelez;

--
-- Name: business_group_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE business_group_sales_id_seq OWNED BY business_group_sales.id;


--
-- Name: business_groups; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE business_groups (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    business_group_type character varying
);


ALTER TABLE business_groups OWNER TO faviovelez;

--
-- Name: business_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE business_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE business_groups_id_seq OWNER TO faviovelez;

--
-- Name: business_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE business_groups_id_seq OWNED BY business_groups.id;


--
-- Name: business_groups_suppliers; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE business_groups_suppliers (
    id integer NOT NULL,
    business_group_id integer,
    supplier_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE business_groups_suppliers OWNER TO faviovelez;

--
-- Name: business_groups_suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE business_groups_suppliers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE business_groups_suppliers_id_seq OWNER TO faviovelez;

--
-- Name: business_groups_suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE business_groups_suppliers_id_seq OWNED BY business_groups_suppliers.id;


--
-- Name: business_unit_sales; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE business_unit_sales (
    id integer NOT NULL,
    business_unit_id integer,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    month integer,
    year integer,
    discount double precision,
    total double precision,
    subtotal double precision,
    taxes double precision,
    quantity integer
);


ALTER TABLE business_unit_sales OWNER TO faviovelez;

--
-- Name: business_unit_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE business_unit_sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE business_unit_sales_id_seq OWNER TO faviovelez;

--
-- Name: business_unit_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE business_unit_sales_id_seq OWNED BY business_unit_sales.id;


--
-- Name: business_units; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE business_units (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    business_group_id integer,
    billing_address_id integer,
    current boolean,
    pending_balance double precision,
    main boolean DEFAULT false
);


ALTER TABLE business_units OWNER TO faviovelez;

--
-- Name: business_units_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE business_units_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE business_units_id_seq OWNER TO faviovelez;

--
-- Name: business_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE business_units_id_seq OWNED BY business_units.id;


--
-- Name: business_units_suppliers; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE business_units_suppliers (
    id integer NOT NULL,
    business_unit_id integer,
    supplier_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE business_units_suppliers OWNER TO faviovelez;

--
-- Name: business_units_suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE business_units_suppliers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE business_units_suppliers_id_seq OWNER TO faviovelez;

--
-- Name: business_units_suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE business_units_suppliers_id_seq OWNED BY business_units_suppliers.id;


--
-- Name: carriers; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE carriers (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    delivery_address_id integer
);


ALTER TABLE carriers OWNER TO faviovelez;

--
-- Name: carriers_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE carriers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE carriers_id_seq OWNER TO faviovelez;

--
-- Name: carriers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE carriers_id_seq OWNED BY carriers.id;


--
-- Name: cash_registers; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE cash_registers (
    id integer NOT NULL,
    name character varying,
    store_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    balance double precision,
    cash_number integer,
    pos boolean DEFAULT false,
    web boolean DEFAULT false,
    date date
);


ALTER TABLE cash_registers OWNER TO faviovelez;

--
-- Name: cash_registers_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE cash_registers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE cash_registers_id_seq OWNER TO faviovelez;

--
-- Name: cash_registers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE cash_registers_id_seq OWNED BY cash_registers.id;


--
-- Name: cfdi_uses; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE cfdi_uses (
    id integer NOT NULL,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    key character varying
);


ALTER TABLE cfdi_uses OWNER TO faviovelez;

--
-- Name: cfdi_uses_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE cfdi_uses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE cfdi_uses_id_seq OWNER TO faviovelez;

--
-- Name: cfdi_uses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE cfdi_uses_id_seq OWNED BY cfdi_uses.id;


--
-- Name: change_tickets; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE change_tickets (
    id integer NOT NULL,
    ticket_id integer,
    ticket_number integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    store_id integer,
    bill_id integer
);


ALTER TABLE change_tickets OWNER TO faviovelez;

--
-- Name: change_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE change_tickets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE change_tickets_id_seq OWNER TO faviovelez;

--
-- Name: change_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE change_tickets_id_seq OWNED BY change_tickets.id;


--
-- Name: classifications; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE classifications (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE classifications OWNER TO faviovelez;

--
-- Name: classifications_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE classifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE classifications_id_seq OWNER TO faviovelez;

--
-- Name: classifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE classifications_id_seq OWNED BY classifications.id;


--
-- Name: cost_types; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE cost_types (
    id integer NOT NULL,
    warehouse_cost_type character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    description character varying
);


ALTER TABLE cost_types OWNER TO faviovelez;

--
-- Name: cost_types_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE cost_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE cost_types_id_seq OWNER TO faviovelez;

--
-- Name: cost_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE cost_types_id_seq OWNED BY cost_types.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE countries (
    id integer NOT NULL,
    key character varying,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE countries OWNER TO faviovelez;

--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE countries_id_seq OWNER TO faviovelez;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE countries_id_seq OWNED BY countries.id;


--
-- Name: currencies; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE currencies (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    description character varying,
    decimals integer
);


ALTER TABLE currencies OWNER TO faviovelez;

--
-- Name: currencies_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE currencies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE currencies_id_seq OWNER TO faviovelez;

--
-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE currencies_id_seq OWNED BY currencies.id;


--
-- Name: delivery_addresses; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE delivery_addresses (
    id integer NOT NULL,
    street character varying,
    exterior_number character varying,
    interior_number character varying,
    zipcode character varying,
    neighborhood character varying,
    city character varying,
    state character varying,
    country character varying,
    type_of_address character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    additional_references text,
    name character varying
);


ALTER TABLE delivery_addresses OWNER TO faviovelez;

--
-- Name: delivery_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE delivery_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE delivery_addresses_id_seq OWNER TO faviovelez;

--
-- Name: delivery_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE delivery_addresses_id_seq OWNED BY delivery_addresses.id;


--
-- Name: delivery_attempts; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE delivery_attempts (
    id integer NOT NULL,
    product_request_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    movement_id integer,
    driver_id integer,
    receiver_id integer
);


ALTER TABLE delivery_attempts OWNER TO faviovelez;

--
-- Name: delivery_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE delivery_attempts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE delivery_attempts_id_seq OWNER TO faviovelez;

--
-- Name: delivery_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE delivery_attempts_id_seq OWNED BY delivery_attempts.id;


--
-- Name: delivery_packages; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE delivery_packages (
    id integer NOT NULL,
    length double precision,
    width double precision,
    height double precision,
    weight double precision,
    order_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    delivery_attempt_id integer
);


ALTER TABLE delivery_packages OWNER TO faviovelez;

--
-- Name: delivery_packages_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE delivery_packages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE delivery_packages_id_seq OWNER TO faviovelez;

--
-- Name: delivery_packages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE delivery_packages_id_seq OWNED BY delivery_packages.id;


--
-- Name: delivery_services; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE delivery_services (
    id integer NOT NULL,
    sender_name character varying,
    sender_zipcode character varying,
    tracking_number character varying,
    receivers_name character varying,
    contact_name character varying,
    street character varying,
    exterior_number character varying,
    interior_number character varying,
    neighborhood character varying,
    city character varying,
    state character varying,
    country character varying,
    phone character varying,
    cellphone character varying,
    email character varying,
    company character varying,
    service_offered_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    receivers_zipcode character varying,
    pos boolean DEFAULT false,
    web boolean DEFAULT true,
    date date
);


ALTER TABLE delivery_services OWNER TO faviovelez;

--
-- Name: delivery_services_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE delivery_services_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE delivery_services_id_seq OWNER TO faviovelez;

--
-- Name: delivery_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE delivery_services_id_seq OWNED BY delivery_services.id;


--
-- Name: deposits; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE deposits (
    id integer NOT NULL,
    user_id integer,
    store_id integer,
    amount double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    cash_register_id integer,
    name character varying
);


ALTER TABLE deposits OWNER TO faviovelez;

--
-- Name: deposits_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE deposits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE deposits_id_seq OWNER TO faviovelez;

--
-- Name: deposits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE deposits_id_seq OWNED BY deposits.id;


--
-- Name: design_costs; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE design_costs (
    id integer NOT NULL,
    complexity character varying,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE design_costs OWNER TO faviovelez;

--
-- Name: design_costs_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE design_costs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE design_costs_id_seq OWNER TO faviovelez;

--
-- Name: design_costs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE design_costs_id_seq OWNED BY design_costs.id;


--
-- Name: design_likes; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE design_likes (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE design_likes OWNER TO faviovelez;

--
-- Name: design_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE design_likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE design_likes_id_seq OWNER TO faviovelez;

--
-- Name: design_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE design_likes_id_seq OWNED BY design_likes.id;


--
-- Name: design_request_users; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE design_request_users (
    id integer NOT NULL,
    design_request_id integer,
    user_id integer
);


ALTER TABLE design_request_users OWNER TO faviovelez;

--
-- Name: design_request_users_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE design_request_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE design_request_users_id_seq OWNER TO faviovelez;

--
-- Name: design_request_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE design_request_users_id_seq OWNED BY design_request_users.id;


--
-- Name: design_requests; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE design_requests (
    id integer NOT NULL,
    design_type character varying,
    cost double precision,
    status character varying,
    authorisation boolean,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    request_id integer,
    description text,
    attachment character varying,
    notes text
);


ALTER TABLE design_requests OWNER TO faviovelez;

--
-- Name: design_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE design_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE design_requests_id_seq OWNER TO faviovelez;

--
-- Name: design_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE design_requests_id_seq OWNED BY design_requests.id;


--
-- Name: discount_rules; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE discount_rules (
    id integer NOT NULL,
    percentage double precision,
    product_list text[] DEFAULT '{}'::text[],
    prospect_list text[] DEFAULT '{}'::text[],
    initial_date date,
    final_date date,
    user_id integer,
    rule character varying,
    minimum_amount double precision DEFAULT 0.0,
    minimum_quantity integer DEFAULT 0,
    exclusions character varying,
    active boolean,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    business_unit_id integer,
    store_id integer,
    prospect_filter character varying,
    product_filter character varying,
    product_all boolean,
    prospect_all boolean,
    product_gift character varying[] DEFAULT '{}'::character varying[],
    line_filter text[] DEFAULT '{}'::text[],
    material_filter text[] DEFAULT '{}'::text[]
);


ALTER TABLE discount_rules OWNER TO faviovelez;

--
-- Name: discount_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE discount_rules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE discount_rules_id_seq OWNER TO faviovelez;

--
-- Name: discount_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE discount_rules_id_seq OWNED BY discount_rules.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE documents (
    id integer NOT NULL,
    request_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    document_type character varying,
    design_request_id integer,
    document character varying
);


ALTER TABLE documents OWNER TO faviovelez;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE documents_id_seq OWNER TO faviovelez;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE documents_id_seq OWNED BY documents.id;


--
-- Name: estimate_docs; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE estimate_docs (
    id integer NOT NULL,
    prospect_id integer,
    user_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    store_id integer
);


ALTER TABLE estimate_docs OWNER TO faviovelez;

--
-- Name: estimate_docs_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE estimate_docs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE estimate_docs_id_seq OWNER TO faviovelez;

--
-- Name: estimate_docs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE estimate_docs_id_seq OWNED BY estimate_docs.id;


--
-- Name: estimates; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE estimates (
    id integer NOT NULL,
    product_id integer,
    quantity integer,
    discount double precision,
    estimate_doc_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE estimates OWNER TO faviovelez;

--
-- Name: estimates_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE estimates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE estimates_id_seq OWNER TO faviovelez;

--
-- Name: estimates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE estimates_id_seq OWNED BY estimates.id;


--
-- Name: exhibition_inventories; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE exhibition_inventories (
    id integer NOT NULL,
    store_id integer,
    product_id integer,
    quantity integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE exhibition_inventories OWNER TO faviovelez;

--
-- Name: exhibition_inventories_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE exhibition_inventories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE exhibition_inventories_id_seq OWNER TO faviovelez;

--
-- Name: exhibition_inventories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE exhibition_inventories_id_seq OWNED BY exhibition_inventories.id;


--
-- Name: expedition_zips; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE expedition_zips (
    id integer NOT NULL,
    zip integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE expedition_zips OWNER TO faviovelez;

--
-- Name: expedition_zips_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE expedition_zips_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE expedition_zips_id_seq OWNER TO faviovelez;

--
-- Name: expedition_zips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE expedition_zips_id_seq OWNED BY expedition_zips.id;


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE expenses (
    id integer NOT NULL,
    subtotal double precision,
    taxes_rate double precision,
    total double precision,
    store_id integer,
    business_unit_id integer,
    user_id integer,
    bill_received_id integer,
    month integer,
    year integer,
    expense_date date,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    expense_type character varying,
    taxes double precision,
    payment_id integer,
    pos boolean DEFAULT false,
    web boolean DEFAULT true,
    date date
);


ALTER TABLE expenses OWNER TO faviovelez;

--
-- Name: expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE expenses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE expenses_id_seq OWNER TO faviovelez;

--
-- Name: expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE expenses_id_seq OWNED BY expenses.id;


--
-- Name: exterior_colors; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE exterior_colors (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE exterior_colors OWNER TO faviovelez;

--
-- Name: exterior_colors_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE exterior_colors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE exterior_colors_id_seq OWNER TO faviovelez;

--
-- Name: exterior_colors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE exterior_colors_id_seq OWNED BY exterior_colors.id;


--
-- Name: finishings; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE finishings (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE finishings OWNER TO faviovelez;

--
-- Name: finishings_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE finishings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE finishings_id_seq OWNER TO faviovelez;

--
-- Name: finishings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE finishings_id_seq OWNED BY finishings.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE images (
    id integer NOT NULL,
    image character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    product_id integer,
    pos boolean DEFAULT false,
    web boolean DEFAULT false,
    date date
);


ALTER TABLE images OWNER TO faviovelez;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE images_id_seq OWNER TO faviovelez;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE images_id_seq OWNED BY images.id;


--
-- Name: impression_types; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE impression_types (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE impression_types OWNER TO faviovelez;

--
-- Name: impression_types_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE impression_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE impression_types_id_seq OWNER TO faviovelez;

--
-- Name: impression_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE impression_types_id_seq OWNED BY impression_types.id;


--
-- Name: interior_colors; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE interior_colors (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE interior_colors OWNER TO faviovelez;

--
-- Name: interior_colors_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE interior_colors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE interior_colors_id_seq OWNER TO faviovelez;

--
-- Name: interior_colors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE interior_colors_id_seq OWNED BY interior_colors.id;


--
-- Name: inventories; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE inventories (
    id integer NOT NULL,
    product_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    quantity integer DEFAULT 0,
    unique_code character varying,
    alert boolean,
    alert_type character varying
);


ALTER TABLE inventories OWNER TO faviovelez;

--
-- Name: inventories_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE inventories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE inventories_id_seq OWNER TO faviovelez;

--
-- Name: inventories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE inventories_id_seq OWNED BY inventories.id;


--
-- Name: material_children; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE material_children (
    id integer NOT NULL,
    name character varying,
    material_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    children_id integer
);


ALTER TABLE material_children OWNER TO faviovelez;

--
-- Name: material_children_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE material_children_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE material_children_id_seq OWNER TO faviovelez;

--
-- Name: material_children_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE material_children_id_seq OWNED BY material_children.id;


--
-- Name: materials; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE materials (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    parent_id integer,
    children_id integer
);


ALTER TABLE materials OWNER TO faviovelez;

--
-- Name: materials_design_likes; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE materials_design_likes (
    id integer NOT NULL,
    material_id integer,
    design_like_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE materials_design_likes OWNER TO faviovelez;

--
-- Name: materials_design_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE materials_design_likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE materials_design_likes_id_seq OWNER TO faviovelez;

--
-- Name: materials_design_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE materials_design_likes_id_seq OWNED BY materials_design_likes.id;


--
-- Name: materials_exterior_colors; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE materials_exterior_colors (
    id integer NOT NULL,
    material_id integer,
    exterior_color_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE materials_exterior_colors OWNER TO faviovelez;

--
-- Name: materials_exterior_colors_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE materials_exterior_colors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE materials_exterior_colors_id_seq OWNER TO faviovelez;

--
-- Name: materials_exterior_colors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE materials_exterior_colors_id_seq OWNED BY materials_exterior_colors.id;


--
-- Name: materials_finishings; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE materials_finishings (
    id integer NOT NULL,
    material_id integer,
    finishing_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE materials_finishings OWNER TO faviovelez;

--
-- Name: materials_finishings_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE materials_finishings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE materials_finishings_id_seq OWNER TO faviovelez;

--
-- Name: materials_finishings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE materials_finishings_id_seq OWNED BY materials_finishings.id;


--
-- Name: materials_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE materials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE materials_id_seq OWNER TO faviovelez;

--
-- Name: materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE materials_id_seq OWNED BY materials.id;


--
-- Name: materials_impression_types; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE materials_impression_types (
    id integer NOT NULL,
    material_id integer,
    impression_type_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE materials_impression_types OWNER TO faviovelez;

--
-- Name: materials_impression_types_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE materials_impression_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE materials_impression_types_id_seq OWNER TO faviovelez;

--
-- Name: materials_impression_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE materials_impression_types_id_seq OWNED BY materials_impression_types.id;


--
-- Name: materials_interior_colors; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE materials_interior_colors (
    id integer NOT NULL,
    material_id integer,
    interior_color_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE materials_interior_colors OWNER TO faviovelez;

--
-- Name: materials_interior_colors_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE materials_interior_colors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE materials_interior_colors_id_seq OWNER TO faviovelez;

--
-- Name: materials_interior_colors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE materials_interior_colors_id_seq OWNED BY materials_interior_colors.id;


--
-- Name: materials_resistances; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE materials_resistances (
    id integer NOT NULL,
    material_id integer,
    resistance_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE materials_resistances OWNER TO faviovelez;

--
-- Name: materials_resistances_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE materials_resistances_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE materials_resistances_id_seq OWNER TO faviovelez;

--
-- Name: materials_resistances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE materials_resistances_id_seq OWNED BY materials_resistances.id;


--
-- Name: movements; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE movements (
    id integer NOT NULL,
    product_id integer,
    quantity integer,
    movement_type character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    order_id integer,
    user_id integer,
    cost double precision,
    unique_code character varying,
    store_id integer,
    initial_price double precision,
    supplier_id integer,
    business_unit_id integer,
    prospect_id integer,
    bill_id integer,
    product_request_id integer,
    maximum_date date,
    confirm boolean DEFAULT false,
    discount_applied double precision DEFAULT 0.0,
    final_price double precision,
    automatic_discount double precision DEFAULT 0.0,
    manual_discount double precision DEFAULT 0.0,
    discount_rule_id integer,
    seller_user_id integer,
    buyer_user_id integer,
    rule_could_be boolean DEFAULT false,
    ticket_id integer,
    tax_id integer,
    taxes double precision,
    total_cost double precision,
    total double precision,
    subtotal double precision,
    entry_movement_id integer
);


ALTER TABLE movements OWNER TO faviovelez;

--
-- Name: movements_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE movements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE movements_id_seq OWNER TO faviovelez;

--
-- Name: movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE movements_id_seq OWNED BY movements.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE orders (
    id integer NOT NULL,
    status character varying,
    delivery_address_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    category character varying,
    prospect_id integer,
    request_id integer,
    billing_address_id integer,
    carrier_id integer,
    store_id integer,
    confirm boolean,
    delivery_notes text,
    bill_id integer,
    delivery_attempt_id integer,
    total double precision,
    subtotal double precision,
    taxes double precision,
    discount_applied double precision,
    cost double precision
);


ALTER TABLE orders OWNER TO faviovelez;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE orders_id_seq OWNER TO faviovelez;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE orders_id_seq OWNED BY orders.id;


--
-- Name: orders_users; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE orders_users (
    id integer NOT NULL,
    order_id integer,
    user_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE orders_users OWNER TO faviovelez;

--
-- Name: orders_users_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE orders_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE orders_users_id_seq OWNER TO faviovelez;

--
-- Name: orders_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE orders_users_id_seq OWNED BY orders_users.id;


--
-- Name: pacs; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE pacs (
    id integer NOT NULL,
    name character varying,
    certificate character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    active boolean DEFAULT true,
    rfc character varying
);


ALTER TABLE pacs OWNER TO faviovelez;

--
-- Name: pacs_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE pacs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pacs_id_seq OWNER TO faviovelez;

--
-- Name: pacs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE pacs_id_seq OWNED BY pacs.id;


--
-- Name: payment_conditions; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE payment_conditions (
    id integer NOT NULL,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE payment_conditions OWNER TO faviovelez;

--
-- Name: payment_conditions_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE payment_conditions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE payment_conditions_id_seq OWNER TO faviovelez;

--
-- Name: payment_conditions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE payment_conditions_id_seq OWNED BY payment_conditions.id;


--
-- Name: payment_forms; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE payment_forms (
    id integer NOT NULL,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    payment_key character varying
);


ALTER TABLE payment_forms OWNER TO faviovelez;

--
-- Name: payment_forms_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE payment_forms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE payment_forms_id_seq OWNER TO faviovelez;

--
-- Name: payment_forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE payment_forms_id_seq OWNED BY payment_forms.id;


--
-- Name: payment_methods; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE payment_methods (
    id integer NOT NULL,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    method character varying
);


ALTER TABLE payment_methods OWNER TO faviovelez;

--
-- Name: payment_methods_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE payment_methods_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE payment_methods_id_seq OWNER TO faviovelez;

--
-- Name: payment_methods_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE payment_methods_id_seq OWNED BY payment_methods.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE payments (
    id integer NOT NULL,
    payment_date date,
    bill_received_id integer,
    supplier_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    user_id integer,
    store_id integer,
    business_unit_id integer,
    payment_form_id integer,
    payment_type character varying,
    bill_id integer,
    terminal_id integer,
    ticket_id integer,
    operation_number character varying,
    payment_number integer,
    bank_id integer,
    credit_days integer,
    total double precision,
    order_id integer,
    pos boolean DEFAULT false,
    web boolean DEFAULT true,
    date date
);


ALTER TABLE payments OWNER TO faviovelez;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE payments_id_seq OWNER TO faviovelez;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE payments_id_seq OWNED BY payments.id;


--
-- Name: pending_movements; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE pending_movements (
    id integer NOT NULL,
    product_id integer,
    quantity integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    order_id integer,
    cost double precision,
    unique_code character varying,
    store_id integer,
    initial_price double precision,
    supplier_id integer,
    movement_type character varying,
    user_id integer,
    business_unit_id integer,
    prospect_id integer,
    bill_id integer,
    product_request_id integer,
    maximum_date date,
    discount_applied double precision DEFAULT 0.0,
    final_price double precision,
    automatic_discount double precision DEFAULT 0.0,
    manual_discount double precision DEFAULT 0.0,
    discount_rule_id integer,
    seller_user_id integer,
    buyer_user_id integer,
    ticket_id integer,
    total_cost double precision,
    total double precision,
    subtotal double precision,
    taxes double precision DEFAULT 0.0
);


ALTER TABLE pending_movements OWNER TO faviovelez;

--
-- Name: pending_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE pending_movements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pending_movements_id_seq OWNER TO faviovelez;

--
-- Name: pending_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE pending_movements_id_seq OWNED BY pending_movements.id;


--
-- Name: pos_entries; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE pos_entries (
    id integer NOT NULL,
    store_id integer,
    product_id integer,
    quantity integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE pos_entries OWNER TO faviovelez;

--
-- Name: pos_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE pos_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pos_entries_id_seq OWNER TO faviovelez;

--
-- Name: pos_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE pos_entries_id_seq OWNED BY pos_entries.id;


--
-- Name: product_requests; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE product_requests (
    id integer NOT NULL,
    product_id integer,
    quantity integer,
    status character varying,
    order_id integer,
    urgency_level character varying,
    maximum_date date,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    armed boolean,
    surplus integer,
    excess integer
);


ALTER TABLE product_requests OWNER TO faviovelez;

--
-- Name: product_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE product_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_requests_id_seq OWNER TO faviovelez;

--
-- Name: product_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE product_requests_id_seq OWNED BY product_requests.id;


--
-- Name: product_sales; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE product_sales (
    id integer NOT NULL,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    product_id integer,
    month integer,
    year integer,
    store_id integer,
    business_unit_id integer,
    discount double precision,
    total double precision,
    subtotal double precision,
    taxes double precision,
    quantity integer
);


ALTER TABLE product_sales OWNER TO faviovelez;

--
-- Name: product_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE product_sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_sales_id_seq OWNER TO faviovelez;

--
-- Name: product_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE product_sales_id_seq OWNED BY product_sales.id;


--
-- Name: product_types; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE product_types (
    id integer NOT NULL,
    product_type character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE product_types OWNER TO faviovelez;

--
-- Name: product_types_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE product_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_types_id_seq OWNER TO faviovelez;

--
-- Name: product_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE product_types_id_seq OWNED BY product_types.id;


--
-- Name: production_orders; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE production_orders (
    id integer NOT NULL,
    user_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    status character varying
);


ALTER TABLE production_orders OWNER TO faviovelez;

--
-- Name: production_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE production_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE production_orders_id_seq OWNER TO faviovelez;

--
-- Name: production_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE production_orders_id_seq OWNED BY production_orders.id;


--
-- Name: production_requests; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE production_requests (
    id integer NOT NULL,
    product_id integer,
    quantity integer,
    status character varying,
    production_order_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE production_requests OWNER TO faviovelez;

--
-- Name: production_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE production_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE production_requests_id_seq OWNER TO faviovelez;

--
-- Name: production_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE production_requests_id_seq OWNED BY production_requests.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE products (
    id integer NOT NULL,
    former_code character varying,
    unique_code character varying,
    description character varying,
    product_type character varying,
    exterior_material_color character varying,
    interior_material_color character varying,
    impression boolean,
    exterior_color_or_design character varying,
    main_material character varying,
    resistance_main_material character varying,
    inner_length double precision,
    inner_width double precision,
    inner_height double precision,
    outer_length double precision,
    outer_width double precision,
    outer_height double precision,
    design_type character varying,
    number_of_pieces integer DEFAULT 1,
    accesories_kit character varying DEFAULT 'ninguno'::character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    price double precision,
    bag_length double precision,
    bag_width double precision,
    bag_height double precision,
    exhibitor_height double precision,
    tray_quantity integer,
    tray_length double precision,
    tray_width double precision,
    tray_divisions integer,
    classification character varying,
    line character varying,
    image character varying,
    pieces_per_package integer DEFAULT 1,
    business_unit_id integer,
    warehouse_id integer,
    cost double precision,
    rack character varying,
    level character varying,
    sat_key_id integer,
    sat_unit_key_id integer,
    current boolean,
    store_id integer,
    supplier_id integer,
    unit_id integer,
    "group" boolean DEFAULT false,
    child_id integer,
    parent_id integer,
    unit character varying,
    pos boolean DEFAULT false,
    web boolean DEFAULT false,
    date date,
    discount_for_stores double precision DEFAULT 0.0,
    discount_for_franchises double precision DEFAULT 0.0,
    factor double precision,
    average double precision,
    stores_discount double precision,
    franchises_discount double precision,
    shared boolean,
    armed boolean DEFAULT false,
    armed_discount double precision DEFAULT 0.0
);


ALTER TABLE products OWNER TO faviovelez;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE products_id_seq OWNER TO faviovelez;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE products_id_seq OWNED BY products.id;


--
-- Name: prospect_sales; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE prospect_sales (
    id integer NOT NULL,
    prospect_id integer,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    month integer,
    year integer,
    store_id integer,
    business_unit_id integer,
    discount double precision,
    total double precision,
    subtotal double precision,
    taxes double precision,
    quantity integer
);


ALTER TABLE prospect_sales OWNER TO faviovelez;

--
-- Name: prospect_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE prospect_sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE prospect_sales_id_seq OWNER TO faviovelez;

--
-- Name: prospect_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE prospect_sales_id_seq OWNED BY prospect_sales.id;


--
-- Name: prospects; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE prospects (
    id integer NOT NULL,
    store_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    prospect_type character varying,
    contact_first_name character varying,
    contact_middle_name character varying,
    contact_last_name character varying,
    contact_position character varying,
    direct_phone character varying,
    extension character varying,
    cell_phone character varying,
    business_type character varying,
    prospect_status character varying,
    legal_or_business_name character varying,
    billing_address_id integer,
    delivery_address_id integer,
    second_last_name character varying,
    business_unit_id integer,
    email character varying,
    business_group_id integer,
    store_code character varying,
    store_type_id integer,
    store_prospect_id integer,
    credit_days integer,
    pos boolean DEFAULT false,
    web boolean DEFAULT true,
    date date
);


ALTER TABLE prospects OWNER TO faviovelez;

--
-- Name: prospects_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE prospects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE prospects_id_seq OWNER TO faviovelez;

--
-- Name: prospects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE prospects_id_seq OWNED BY prospects.id;


--
-- Name: relation_types; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE relation_types (
    id integer NOT NULL,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    key character varying
);


ALTER TABLE relation_types OWNER TO faviovelez;

--
-- Name: relation_types_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE relation_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE relation_types_id_seq OWNER TO faviovelez;

--
-- Name: relation_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE relation_types_id_seq OWNED BY relation_types.id;


--
-- Name: request_users; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE request_users (
    id integer NOT NULL,
    request_id integer,
    user_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE request_users OWNER TO faviovelez;

--
-- Name: request_users_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE request_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE request_users_id_seq OWNER TO faviovelez;

--
-- Name: request_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE request_users_id_seq OWNED BY request_users.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE requests (
    id integer NOT NULL,
    product_type character varying,
    product_what character varying,
    product_length double precision,
    product_width double precision,
    product_height double precision,
    product_weight double precision,
    for_what character varying,
    quantity integer,
    inner_length double precision,
    inner_width double precision,
    outer_length double precision,
    outer_width double precision,
    outer_height double precision,
    bag_length double precision,
    bag_width double precision,
    bag_height double precision,
    main_material character varying,
    resistance_main_material character varying,
    secondary_material character varying,
    resistance_secondary_material character varying,
    third_material character varying,
    resistance_third_material character varying,
    impression character varying,
    inks integer,
    impression_finishing character varying,
    delivery_date date,
    maximum_sales_price double precision,
    observations text,
    notes text,
    prospect_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    final_quantity integer,
    payment_uploaded boolean,
    authorisation_signed boolean,
    date_finished date,
    internal_cost double precision,
    internal_price double precision,
    sales_price double precision,
    impression_where character varying,
    design_like character varying,
    resistance_like character varying,
    rigid_color character varying,
    paper_type_rigid character varying,
    store_id integer,
    require_design boolean,
    exterior_material_color character varying,
    interior_material_color character varying,
    status character varying,
    exhibitor_height double precision,
    tray_quantity integer,
    tray_length double precision,
    tray_width double precision,
    tray_divisions integer,
    name_type character varying,
    contraencolado boolean,
    authorised_without_doc boolean,
    how_many character varying,
    authorised_without_pay boolean,
    boxes_stow character varying,
    specification character varying,
    what_measures character varying,
    specification_document boolean,
    sensitive_fields_changed boolean,
    payment character varying,
    authorisation character varying,
    authorised boolean,
    last_status character varying,
    product_id integer,
    estimate_doc_id integer,
    second_quantity integer,
    third_quantity integer,
    second_internal_cost double precision,
    third_internal_cost double precision,
    second_internal_price double precision,
    third_internal_price double precision,
    second_sales_price double precision,
    third_sales_price double precision,
    price_selected integer,
    inner_height double precision
);


ALTER TABLE requests OWNER TO faviovelez;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE requests_id_seq OWNER TO faviovelez;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE requests_id_seq OWNED BY requests.id;


--
-- Name: resistances; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE resistances (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE resistances OWNER TO faviovelez;

--
-- Name: resistances_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE resistances_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE resistances_id_seq OWNER TO faviovelez;

--
-- Name: resistances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE resistances_id_seq OWNED BY resistances.id;


--
-- Name: return_tickets; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE return_tickets (
    id integer NOT NULL,
    ticket_id integer,
    ticket_number integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    store_id integer,
    bill_id integer
);


ALTER TABLE return_tickets OWNER TO faviovelez;

--
-- Name: return_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE return_tickets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE return_tickets_id_seq OWNER TO faviovelez;

--
-- Name: return_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE return_tickets_id_seq OWNED BY return_tickets.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE roles (
    id integer NOT NULL,
    name character varying,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    translation character varying
);


ALTER TABLE roles OWNER TO faviovelez;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE roles_id_seq OWNER TO faviovelez;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE roles_id_seq OWNED BY roles.id;


--
-- Name: rows; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE rows (
    id integer NOT NULL,
    bill_id integer,
    product integer,
    service integer,
    unique_code character varying,
    quantity integer,
    unit_value double precision,
    ticket integer,
    sat_key character varying,
    sat_unit_key character varying,
    description text,
    total double precision,
    subtotal double precision,
    taxes double precision,
    discount double precision,
    sat_unit_description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE rows OWNER TO faviovelez;

--
-- Name: rows_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE rows_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE rows_id_seq OWNER TO faviovelez;

--
-- Name: rows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE rows_id_seq OWNED BY rows.id;


--
-- Name: sales_movements; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE sales_movements (
    id integer NOT NULL,
    sales_id integer,
    movement_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE sales_movements OWNER TO faviovelez;

--
-- Name: sales_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE sales_movements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sales_movements_id_seq OWNER TO faviovelez;

--
-- Name: sales_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE sales_movements_id_seq OWNED BY sales_movements.id;


--
-- Name: sales_targets; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE sales_targets (
    id integer NOT NULL,
    store_id integer,
    month integer,
    year integer,
    target double precision,
    actual_sales double precision,
    achieved boolean,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE sales_targets OWNER TO faviovelez;

--
-- Name: sales_targets_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE sales_targets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sales_targets_id_seq OWNER TO faviovelez;

--
-- Name: sales_targets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE sales_targets_id_seq OWNED BY sales_targets.id;


--
-- Name: sat_keys; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE sat_keys (
    id integer NOT NULL,
    sat_key character varying,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE sat_keys OWNER TO faviovelez;

--
-- Name: sat_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE sat_keys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sat_keys_id_seq OWNER TO faviovelez;

--
-- Name: sat_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE sat_keys_id_seq OWNED BY sat_keys.id;


--
-- Name: sat_unit_keys; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE sat_unit_keys (
    id integer NOT NULL,
    unit character varying,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE sat_unit_keys OWNER TO faviovelez;

--
-- Name: sat_unit_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE sat_unit_keys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sat_unit_keys_id_seq OWNER TO faviovelez;

--
-- Name: sat_unit_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE sat_unit_keys_id_seq OWNED BY sat_unit_keys.id;


--
-- Name: sat_zipcodes; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE sat_zipcodes (
    id integer NOT NULL,
    zipcode character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE sat_zipcodes OWNER TO faviovelez;

--
-- Name: sat_zipcodes_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE sat_zipcodes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sat_zipcodes_id_seq OWNER TO faviovelez;

--
-- Name: sat_zipcodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE sat_zipcodes_id_seq OWNED BY sat_zipcodes.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE schema_migrations (
    version character varying NOT NULL
);


ALTER TABLE schema_migrations OWNER TO faviovelez;

--
-- Name: service_offereds; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE service_offereds (
    id integer NOT NULL,
    service_id integer,
    store_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    initial_price double precision,
    automatic_discount double precision DEFAULT 0.0,
    manual_discount double precision DEFAULT 0.0,
    discount_applied double precision DEFAULT 0.0,
    rule_could_be boolean,
    final_price double precision,
    service_type character varying,
    tax_id integer,
    taxes double precision,
    cost double precision,
    ticket_id integer,
    total_cost double precision,
    quantity integer,
    discount_reason character varying,
    total double precision,
    subtotal double precision,
    pos boolean DEFAULT false,
    web boolean DEFAULT true,
    date date
);


ALTER TABLE service_offereds OWNER TO faviovelez;

--
-- Name: service_offereds_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE service_offereds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE service_offereds_id_seq OWNER TO faviovelez;

--
-- Name: service_offereds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE service_offereds_id_seq OWNED BY service_offereds.id;


--
-- Name: service_sales; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE service_sales (
    id integer NOT NULL,
    store_id integer,
    year integer,
    month integer,
    cost double precision,
    total double precision,
    subtotal double precision,
    taxes double precision,
    discount double precision,
    quantity integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    service_id integer
);


ALTER TABLE service_sales OWNER TO faviovelez;

--
-- Name: service_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE service_sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE service_sales_id_seq OWNER TO faviovelez;

--
-- Name: service_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE service_sales_id_seq OWNED BY service_sales.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE services (
    id integer NOT NULL,
    unique_code character varying,
    description text,
    price double precision,
    sat_key_id integer,
    unit character varying,
    sat_unit_key_id integer,
    shared boolean,
    store_id integer,
    business_unit_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    delivery_company character varying,
    current boolean
);


ALTER TABLE services OWNER TO faviovelez;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE services_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE services_id_seq OWNER TO faviovelez;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE services_id_seq OWNED BY services.id;


--
-- Name: store_movements; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE store_movements (
    id integer NOT NULL,
    product_id integer,
    quantity integer,
    movement_type character varying,
    order_id integer,
    ticket_id integer,
    store_id integer,
    initial_price double precision,
    automatic_discount double precision DEFAULT 0.0,
    manual_discount double precision DEFAULT 0.0,
    discount_applied double precision DEFAULT 0.0,
    rule_could_be boolean,
    final_price double precision,
    tax_id integer,
    taxes double precision,
    cost double precision,
    supplier_id integer,
    product_request_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    total_cost double precision,
    discount_reason character varying,
    total double precision,
    subtotal double precision,
    bill_id integer,
    pos boolean DEFAULT false,
    web boolean DEFAULT true,
    date date
);


ALTER TABLE store_movements OWNER TO faviovelez;

--
-- Name: store_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE store_movements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE store_movements_id_seq OWNER TO faviovelez;

--
-- Name: store_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE store_movements_id_seq OWNED BY store_movements.id;


--
-- Name: store_sales; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE store_sales (
    id integer NOT NULL,
    store_id integer,
    month character varying,
    year character varying,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    discount double precision,
    total double precision,
    subtotal double precision,
    taxes double precision,
    quantity integer,
    payments double precision,
    expenses double precision
);


ALTER TABLE store_sales OWNER TO faviovelez;

--
-- Name: store_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE store_sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE store_sales_id_seq OWNER TO faviovelez;

--
-- Name: store_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE store_sales_id_seq OWNED BY store_sales.id;


--
-- Name: store_types; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE store_types (
    id integer NOT NULL,
    store_type character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE store_types OWNER TO faviovelez;

--
-- Name: store_types_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE store_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE store_types_id_seq OWNER TO faviovelez;

--
-- Name: store_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE store_types_id_seq OWNED BY store_types.id;


--
-- Name: store_use_inventories; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE store_use_inventories (
    id integer NOT NULL,
    store_id integer,
    product_id integer,
    quantity integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE store_use_inventories OWNER TO faviovelez;

--
-- Name: store_use_inventories_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE store_use_inventories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE store_use_inventories_id_seq OWNER TO faviovelez;

--
-- Name: store_use_inventories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE store_use_inventories_id_seq OWNED BY store_use_inventories.id;


--
-- Name: stores; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE stores (
    id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    store_code character varying,
    store_name character varying,
    delivery_address_id integer,
    business_unit_id integer,
    store_type_id integer,
    email character varying,
    cost_type_id integer,
    cost_type_selected_since date,
    months_in_inventory integer DEFAULT 3,
    reorder_point double precision DEFAULT 50.0,
    critical_point double precision DEFAULT 25.0,
    contact_first_name character varying,
    contact_middle_name character varying,
    contact_last_name character varying,
    direct_phone character varying,
    extension character varying,
    type_of_person character varying,
    second_last_name character varying,
    business_group_id integer,
    cell_phone character varying,
    zip_code character varying,
    period_sales_achievement boolean,
    inspection_approved boolean,
    overprice double precision DEFAULT 0.0,
    series character varying,
    last_bill integer DEFAULT 0,
    install_code character varying,
    certificate character varying,
    key character varying,
    certificate_password character varying,
    certificate_number character varying,
    certificate_content text,
    bill_last_folio integer DEFAULT 0,
    credit_note_last_folio integer DEFAULT 0,
    debit_note_last_folio integer DEFAULT 0,
    return_last_folio integer DEFAULT 0,
    pay_bill_last_folio integer DEFAULT 0,
    advance_e_last_folio integer DEFAULT 0,
    advance_i_last_folio integer DEFAULT 0,
    initial_inventory character varying,
    current_inventory character varying,
    prospects_file character varying
);


ALTER TABLE stores OWNER TO faviovelez;

--
-- Name: stores_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE stores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE stores_id_seq OWNER TO faviovelez;

--
-- Name: stores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE stores_id_seq OWNED BY stores.id;


--
-- Name: stores_inventories; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE stores_inventories (
    id integer NOT NULL,
    product_id integer,
    store_id integer,
    quantity integer DEFAULT 0,
    alert boolean DEFAULT false,
    alert_type character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    rack character varying,
    level character varying,
    manual_price_update boolean DEFAULT false,
    pos boolean DEFAULT false,
    web boolean DEFAULT true,
    date date,
    manual_price double precision
);


ALTER TABLE stores_inventories OWNER TO faviovelez;

--
-- Name: stores_inventories_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE stores_inventories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE stores_inventories_id_seq OWNER TO faviovelez;

--
-- Name: stores_inventories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE stores_inventories_id_seq OWNED BY stores_inventories.id;


--
-- Name: stores_suppliers; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE stores_suppliers (
    id integer NOT NULL,
    store_id integer,
    supplier_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE stores_suppliers OWNER TO faviovelez;

--
-- Name: stores_suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE stores_suppliers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE stores_suppliers_id_seq OWNER TO faviovelez;

--
-- Name: stores_suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE stores_suppliers_id_seq OWNED BY stores_suppliers.id;


--
-- Name: stores_warehouse_entries; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE stores_warehouse_entries (
    id integer NOT NULL,
    product_id integer,
    store_id integer,
    quantity integer DEFAULT 0,
    movement_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    retail_units_per_unit integer,
    units_used integer,
    store_movement_id integer,
    pos boolean DEFAULT false,
    web boolean DEFAULT true,
    date date
);


ALTER TABLE stores_warehouse_entries OWNER TO faviovelez;

--
-- Name: stores_warehouse_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE stores_warehouse_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE stores_warehouse_entries_id_seq OWNER TO faviovelez;

--
-- Name: stores_warehouse_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE stores_warehouse_entries_id_seq OWNED BY stores_warehouse_entries.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE suppliers (
    id integer NOT NULL,
    name character varying,
    business_type character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    type_of_person character varying,
    contact_first_name character varying,
    contact_middle_name character varying,
    contact_last_name character varying,
    contact_position character varying,
    direct_phone character varying,
    extension character varying,
    cell_phone character varying,
    email character varying,
    supplier_status character varying,
    delivery_address_id integer,
    last_purchase_bill_date date,
    store_id integer,
    last_purchase_folio character varying
);


ALTER TABLE suppliers OWNER TO faviovelez;

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE suppliers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE suppliers_id_seq OWNER TO faviovelez;

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE suppliers_id_seq OWNED BY suppliers.id;


--
-- Name: tax_regimes; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE tax_regimes (
    id integer NOT NULL,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    tax_id integer,
    corporate boolean,
    particular boolean,
    date_since date
);


ALTER TABLE tax_regimes OWNER TO faviovelez;

--
-- Name: tax_regimes_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE tax_regimes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tax_regimes_id_seq OWNER TO faviovelez;

--
-- Name: tax_regimes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE tax_regimes_id_seq OWNED BY tax_regimes.id;


--
-- Name: taxes; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE taxes (
    id integer NOT NULL,
    description character varying,
    value double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    key character varying,
    transfer boolean,
    retention boolean
);


ALTER TABLE taxes OWNER TO faviovelez;

--
-- Name: taxes_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE taxes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE taxes_id_seq OWNER TO faviovelez;

--
-- Name: taxes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE taxes_id_seq OWNED BY taxes.id;


--
-- Name: temporal_numbers; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE temporal_numbers (
    id integer NOT NULL,
    store_id integer,
    business_group_id integer,
    past_sales character varying[] DEFAULT '{}'::character varying[],
    future_sales character varying[] DEFAULT '{}'::character varying[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE temporal_numbers OWNER TO faviovelez;

--
-- Name: temporal_numbers_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE temporal_numbers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE temporal_numbers_id_seq OWNER TO faviovelez;

--
-- Name: temporal_numbers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE temporal_numbers_id_seq OWNED BY temporal_numbers.id;


--
-- Name: terminals; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE terminals (
    id integer NOT NULL,
    name character varying,
    bank_id integer,
    number character varying,
    store_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    debit_comission double precision,
    credit_comission double precision,
    pos boolean DEFAULT false,
    web boolean DEFAULT false,
    date date
);


ALTER TABLE terminals OWNER TO faviovelez;

--
-- Name: terminals_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE terminals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE terminals_id_seq OWNER TO faviovelez;

--
-- Name: terminals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE terminals_id_seq OWNED BY terminals.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE tickets (
    id integer NOT NULL,
    user_id integer,
    store_id integer,
    subtotal double precision,
    tax_id integer,
    taxes double precision,
    total double precision,
    prospect_id integer,
    bill_id integer,
    ticket_type character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    cash_register_id integer,
    ticket_number integer,
    cfdi_use_id integer,
    comments character varying,
    payments_amount double precision,
    discount_applied double precision,
    cash_return double precision,
    payed boolean DEFAULT false,
    parent_id integer,
    cost double precision,
    saved boolean,
    pos boolean DEFAULT false,
    web boolean DEFAULT false,
    date date
);


ALTER TABLE tickets OWNER TO faviovelez;

--
-- Name: tickets_children; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE tickets_children (
    id integer NOT NULL,
    ticket_id integer,
    children_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    pos boolean DEFAULT false,
    web boolean DEFAULT false,
    date date
);


ALTER TABLE tickets_children OWNER TO faviovelez;

--
-- Name: tickets_children_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE tickets_children_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tickets_children_id_seq OWNER TO faviovelez;

--
-- Name: tickets_children_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE tickets_children_id_seq OWNED BY tickets_children.id;


--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE tickets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tickets_id_seq OWNER TO faviovelez;

--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE tickets_id_seq OWNED BY tickets.id;


--
-- Name: type_of_bills; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE type_of_bills (
    id integer NOT NULL,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    key character varying
);


ALTER TABLE type_of_bills OWNER TO faviovelez;

--
-- Name: type_of_bills_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE type_of_bills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE type_of_bills_id_seq OWNER TO faviovelez;

--
-- Name: type_of_bills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE type_of_bills_id_seq OWNED BY type_of_bills.id;


--
-- Name: units; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE units (
    id integer NOT NULL,
    name character varying,
    plural_name character varying,
    abbreviation character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE units OWNER TO faviovelez;

--
-- Name: units_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE units_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE units_id_seq OWNER TO faviovelez;

--
-- Name: units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE units_id_seq OWNED BY units.id;


--
-- Name: user_requests; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE user_requests (
    id integer NOT NULL,
    user_id integer,
    request_id integer
);


ALTER TABLE user_requests OWNER TO faviovelez;

--
-- Name: user_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE user_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_requests_id_seq OWNER TO faviovelez;

--
-- Name: user_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE user_requests_id_seq OWNED BY user_requests.id;


--
-- Name: user_sales; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE user_sales (
    id integer NOT NULL,
    user_id integer,
    month character varying,
    year character varying,
    sales_amount double precision,
    sales_quantity integer,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE user_sales OWNER TO faviovelez;

--
-- Name: user_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE user_sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_sales_id_seq OWNER TO faviovelez;

--
-- Name: user_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE user_sales_id_seq OWNED BY user_sales.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0 NOT NULL,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip character varying,
    last_sign_in_ip character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    first_name character varying,
    middle_name character varying,
    last_name character varying,
    store_id integer,
    role_id integer,
    web boolean,
    pos boolean,
    date date
);


ALTER TABLE users OWNER TO faviovelez;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO faviovelez;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: warehouse_entries; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE warehouse_entries (
    id integer NOT NULL,
    product_id integer,
    quantity integer,
    entry_number integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    movement_id integer,
    store_id integer,
    retail_units_per_unit integer,
    units_used integer
);


ALTER TABLE warehouse_entries OWNER TO faviovelez;

--
-- Name: warehouse_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE warehouse_entries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE warehouse_entries_id_seq OWNER TO faviovelez;

--
-- Name: warehouse_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE warehouse_entries_id_seq OWNED BY warehouse_entries.id;


--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE warehouses (
    id integer NOT NULL,
    name character varying,
    delivery_address_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    business_unit_id integer,
    store_id integer,
    warehouse_code character varying,
    business_group_id integer
);


ALTER TABLE warehouses OWNER TO faviovelez;

--
-- Name: warehouses_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE warehouses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE warehouses_id_seq OWNER TO faviovelez;

--
-- Name: warehouses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE warehouses_id_seq OWNED BY warehouses.id;


--
-- Name: withdrawals; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE withdrawals (
    id integer NOT NULL,
    user_id integer,
    store_id integer,
    amount double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    cash_register_id integer,
    name character varying
);


ALTER TABLE withdrawals OWNER TO faviovelez;

--
-- Name: withdrawals_id_seq; Type: SEQUENCE; Schema: public; Owner: faviovelez
--

CREATE SEQUENCE withdrawals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE withdrawals_id_seq OWNER TO faviovelez;

--
-- Name: withdrawals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: faviovelez
--

ALTER SEQUENCE withdrawals_id_seq OWNED BY withdrawals.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY bank_balances ALTER COLUMN id SET DEFAULT nextval('bank_balances_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY banks ALTER COLUMN id SET DEFAULT nextval('banks_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY bill_receiveds ALTER COLUMN id SET DEFAULT nextval('bill_receiveds_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY bill_sales ALTER COLUMN id SET DEFAULT nextval('bill_sales_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY billing_addresses ALTER COLUMN id SET DEFAULT nextval('billing_addresses_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY bills ALTER COLUMN id SET DEFAULT nextval('bills_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY bills_children ALTER COLUMN id SET DEFAULT nextval('bills_children_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_group_sales ALTER COLUMN id SET DEFAULT nextval('business_group_sales_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_groups ALTER COLUMN id SET DEFAULT nextval('business_groups_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_groups_suppliers ALTER COLUMN id SET DEFAULT nextval('business_groups_suppliers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_unit_sales ALTER COLUMN id SET DEFAULT nextval('business_unit_sales_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_units ALTER COLUMN id SET DEFAULT nextval('business_units_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_units_suppliers ALTER COLUMN id SET DEFAULT nextval('business_units_suppliers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY carriers ALTER COLUMN id SET DEFAULT nextval('carriers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY cash_registers ALTER COLUMN id SET DEFAULT nextval('cash_registers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY cfdi_uses ALTER COLUMN id SET DEFAULT nextval('cfdi_uses_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY change_tickets ALTER COLUMN id SET DEFAULT nextval('change_tickets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY classifications ALTER COLUMN id SET DEFAULT nextval('classifications_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY cost_types ALTER COLUMN id SET DEFAULT nextval('cost_types_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY countries ALTER COLUMN id SET DEFAULT nextval('countries_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY currencies ALTER COLUMN id SET DEFAULT nextval('currencies_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY delivery_addresses ALTER COLUMN id SET DEFAULT nextval('delivery_addresses_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY delivery_attempts ALTER COLUMN id SET DEFAULT nextval('delivery_attempts_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY delivery_packages ALTER COLUMN id SET DEFAULT nextval('delivery_packages_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY delivery_services ALTER COLUMN id SET DEFAULT nextval('delivery_services_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY deposits ALTER COLUMN id SET DEFAULT nextval('deposits_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY design_costs ALTER COLUMN id SET DEFAULT nextval('design_costs_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY design_likes ALTER COLUMN id SET DEFAULT nextval('design_likes_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY design_request_users ALTER COLUMN id SET DEFAULT nextval('design_request_users_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY design_requests ALTER COLUMN id SET DEFAULT nextval('design_requests_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY discount_rules ALTER COLUMN id SET DEFAULT nextval('discount_rules_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY documents ALTER COLUMN id SET DEFAULT nextval('documents_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY estimate_docs ALTER COLUMN id SET DEFAULT nextval('estimate_docs_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY estimates ALTER COLUMN id SET DEFAULT nextval('estimates_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY exhibition_inventories ALTER COLUMN id SET DEFAULT nextval('exhibition_inventories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY expedition_zips ALTER COLUMN id SET DEFAULT nextval('expedition_zips_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY expenses ALTER COLUMN id SET DEFAULT nextval('expenses_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY exterior_colors ALTER COLUMN id SET DEFAULT nextval('exterior_colors_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY finishings ALTER COLUMN id SET DEFAULT nextval('finishings_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY images ALTER COLUMN id SET DEFAULT nextval('images_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY impression_types ALTER COLUMN id SET DEFAULT nextval('impression_types_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY interior_colors ALTER COLUMN id SET DEFAULT nextval('interior_colors_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY inventories ALTER COLUMN id SET DEFAULT nextval('inventories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY material_children ALTER COLUMN id SET DEFAULT nextval('material_children_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials ALTER COLUMN id SET DEFAULT nextval('materials_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_design_likes ALTER COLUMN id SET DEFAULT nextval('materials_design_likes_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_exterior_colors ALTER COLUMN id SET DEFAULT nextval('materials_exterior_colors_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_finishings ALTER COLUMN id SET DEFAULT nextval('materials_finishings_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_impression_types ALTER COLUMN id SET DEFAULT nextval('materials_impression_types_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_interior_colors ALTER COLUMN id SET DEFAULT nextval('materials_interior_colors_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_resistances ALTER COLUMN id SET DEFAULT nextval('materials_resistances_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY movements ALTER COLUMN id SET DEFAULT nextval('movements_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY orders ALTER COLUMN id SET DEFAULT nextval('orders_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY orders_users ALTER COLUMN id SET DEFAULT nextval('orders_users_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY pacs ALTER COLUMN id SET DEFAULT nextval('pacs_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY payment_conditions ALTER COLUMN id SET DEFAULT nextval('payment_conditions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY payment_forms ALTER COLUMN id SET DEFAULT nextval('payment_forms_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY payment_methods ALTER COLUMN id SET DEFAULT nextval('payment_methods_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY payments ALTER COLUMN id SET DEFAULT nextval('payments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY pending_movements ALTER COLUMN id SET DEFAULT nextval('pending_movements_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY pos_entries ALTER COLUMN id SET DEFAULT nextval('pos_entries_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY product_requests ALTER COLUMN id SET DEFAULT nextval('product_requests_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY product_sales ALTER COLUMN id SET DEFAULT nextval('product_sales_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY product_types ALTER COLUMN id SET DEFAULT nextval('product_types_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY production_orders ALTER COLUMN id SET DEFAULT nextval('production_orders_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY production_requests ALTER COLUMN id SET DEFAULT nextval('production_requests_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY products ALTER COLUMN id SET DEFAULT nextval('products_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY prospect_sales ALTER COLUMN id SET DEFAULT nextval('prospect_sales_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY prospects ALTER COLUMN id SET DEFAULT nextval('prospects_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY relation_types ALTER COLUMN id SET DEFAULT nextval('relation_types_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY request_users ALTER COLUMN id SET DEFAULT nextval('request_users_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY requests ALTER COLUMN id SET DEFAULT nextval('requests_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY resistances ALTER COLUMN id SET DEFAULT nextval('resistances_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY return_tickets ALTER COLUMN id SET DEFAULT nextval('return_tickets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY roles ALTER COLUMN id SET DEFAULT nextval('roles_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY rows ALTER COLUMN id SET DEFAULT nextval('rows_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY sales_movements ALTER COLUMN id SET DEFAULT nextval('sales_movements_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY sales_targets ALTER COLUMN id SET DEFAULT nextval('sales_targets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY sat_keys ALTER COLUMN id SET DEFAULT nextval('sat_keys_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY sat_unit_keys ALTER COLUMN id SET DEFAULT nextval('sat_unit_keys_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY sat_zipcodes ALTER COLUMN id SET DEFAULT nextval('sat_zipcodes_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY service_offereds ALTER COLUMN id SET DEFAULT nextval('service_offereds_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY service_sales ALTER COLUMN id SET DEFAULT nextval('service_sales_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY services ALTER COLUMN id SET DEFAULT nextval('services_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY store_movements ALTER COLUMN id SET DEFAULT nextval('store_movements_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY store_sales ALTER COLUMN id SET DEFAULT nextval('store_sales_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY store_types ALTER COLUMN id SET DEFAULT nextval('store_types_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY store_use_inventories ALTER COLUMN id SET DEFAULT nextval('store_use_inventories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY stores ALTER COLUMN id SET DEFAULT nextval('stores_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY stores_inventories ALTER COLUMN id SET DEFAULT nextval('stores_inventories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY stores_suppliers ALTER COLUMN id SET DEFAULT nextval('stores_suppliers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY stores_warehouse_entries ALTER COLUMN id SET DEFAULT nextval('stores_warehouse_entries_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY suppliers ALTER COLUMN id SET DEFAULT nextval('suppliers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY tax_regimes ALTER COLUMN id SET DEFAULT nextval('tax_regimes_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY taxes ALTER COLUMN id SET DEFAULT nextval('taxes_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY temporal_numbers ALTER COLUMN id SET DEFAULT nextval('temporal_numbers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY terminals ALTER COLUMN id SET DEFAULT nextval('terminals_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY tickets ALTER COLUMN id SET DEFAULT nextval('tickets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY tickets_children ALTER COLUMN id SET DEFAULT nextval('tickets_children_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY type_of_bills ALTER COLUMN id SET DEFAULT nextval('type_of_bills_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY units ALTER COLUMN id SET DEFAULT nextval('units_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY user_requests ALTER COLUMN id SET DEFAULT nextval('user_requests_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY user_sales ALTER COLUMN id SET DEFAULT nextval('user_sales_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY warehouse_entries ALTER COLUMN id SET DEFAULT nextval('warehouse_entries_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY warehouses ALTER COLUMN id SET DEFAULT nextval('warehouses_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY withdrawals ALTER COLUMN id SET DEFAULT nextval('withdrawals_id_seq'::regclass);


--
-- Name: bank_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY bank_balances
    ADD CONSTRAINT bank_balances_pkey PRIMARY KEY (id);


--
-- Name: banks_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY banks
    ADD CONSTRAINT banks_pkey PRIMARY KEY (id);


--
-- Name: bill_receiveds_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY bill_receiveds
    ADD CONSTRAINT bill_receiveds_pkey PRIMARY KEY (id);


--
-- Name: bill_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY bill_sales
    ADD CONSTRAINT bill_sales_pkey PRIMARY KEY (id);


--
-- Name: billing_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY billing_addresses
    ADD CONSTRAINT billing_addresses_pkey PRIMARY KEY (id);


--
-- Name: bills_children_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY bills_children
    ADD CONSTRAINT bills_children_pkey PRIMARY KEY (id);


--
-- Name: bills_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (id);


--
-- Name: business_group_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_group_sales
    ADD CONSTRAINT business_group_sales_pkey PRIMARY KEY (id);


--
-- Name: business_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_groups
    ADD CONSTRAINT business_groups_pkey PRIMARY KEY (id);


--
-- Name: business_groups_suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_groups_suppliers
    ADD CONSTRAINT business_groups_suppliers_pkey PRIMARY KEY (id);


--
-- Name: business_unit_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_unit_sales
    ADD CONSTRAINT business_unit_sales_pkey PRIMARY KEY (id);


--
-- Name: business_units_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_units
    ADD CONSTRAINT business_units_pkey PRIMARY KEY (id);


--
-- Name: business_units_suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY business_units_suppliers
    ADD CONSTRAINT business_units_suppliers_pkey PRIMARY KEY (id);


--
-- Name: carriers_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY carriers
    ADD CONSTRAINT carriers_pkey PRIMARY KEY (id);


--
-- Name: cash_registers_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY cash_registers
    ADD CONSTRAINT cash_registers_pkey PRIMARY KEY (id);


--
-- Name: cfdi_uses_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY cfdi_uses
    ADD CONSTRAINT cfdi_uses_pkey PRIMARY KEY (id);


--
-- Name: change_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY change_tickets
    ADD CONSTRAINT change_tickets_pkey PRIMARY KEY (id);


--
-- Name: classifications_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY classifications
    ADD CONSTRAINT classifications_pkey PRIMARY KEY (id);


--
-- Name: cost_types_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY cost_types
    ADD CONSTRAINT cost_types_pkey PRIMARY KEY (id);


--
-- Name: countries_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (id);


--
-- Name: delivery_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY delivery_addresses
    ADD CONSTRAINT delivery_addresses_pkey PRIMARY KEY (id);


--
-- Name: delivery_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY delivery_attempts
    ADD CONSTRAINT delivery_attempts_pkey PRIMARY KEY (id);


--
-- Name: delivery_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY delivery_packages
    ADD CONSTRAINT delivery_packages_pkey PRIMARY KEY (id);


--
-- Name: delivery_services_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY delivery_services
    ADD CONSTRAINT delivery_services_pkey PRIMARY KEY (id);


--
-- Name: deposits_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY deposits
    ADD CONSTRAINT deposits_pkey PRIMARY KEY (id);


--
-- Name: design_costs_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY design_costs
    ADD CONSTRAINT design_costs_pkey PRIMARY KEY (id);


--
-- Name: design_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY design_likes
    ADD CONSTRAINT design_likes_pkey PRIMARY KEY (id);


--
-- Name: design_request_users_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY design_request_users
    ADD CONSTRAINT design_request_users_pkey PRIMARY KEY (id);


--
-- Name: design_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY design_requests
    ADD CONSTRAINT design_requests_pkey PRIMARY KEY (id);


--
-- Name: discount_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY discount_rules
    ADD CONSTRAINT discount_rules_pkey PRIMARY KEY (id);


--
-- Name: documents_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: estimate_docs_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY estimate_docs
    ADD CONSTRAINT estimate_docs_pkey PRIMARY KEY (id);


--
-- Name: estimates_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY estimates
    ADD CONSTRAINT estimates_pkey PRIMARY KEY (id);


--
-- Name: exhibition_inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY exhibition_inventories
    ADD CONSTRAINT exhibition_inventories_pkey PRIMARY KEY (id);


--
-- Name: expedition_zips_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY expedition_zips
    ADD CONSTRAINT expedition_zips_pkey PRIMARY KEY (id);


--
-- Name: expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: exterior_colors_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY exterior_colors
    ADD CONSTRAINT exterior_colors_pkey PRIMARY KEY (id);


--
-- Name: finishings_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY finishings
    ADD CONSTRAINT finishings_pkey PRIMARY KEY (id);


--
-- Name: images_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: impression_types_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY impression_types
    ADD CONSTRAINT impression_types_pkey PRIMARY KEY (id);


--
-- Name: interior_colors_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY interior_colors
    ADD CONSTRAINT interior_colors_pkey PRIMARY KEY (id);


--
-- Name: inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY inventories
    ADD CONSTRAINT inventories_pkey PRIMARY KEY (id);


--
-- Name: material_children_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY material_children
    ADD CONSTRAINT material_children_pkey PRIMARY KEY (id);


--
-- Name: materials_design_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_design_likes
    ADD CONSTRAINT materials_design_likes_pkey PRIMARY KEY (id);


--
-- Name: materials_exterior_colors_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_exterior_colors
    ADD CONSTRAINT materials_exterior_colors_pkey PRIMARY KEY (id);


--
-- Name: materials_finishings_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_finishings
    ADD CONSTRAINT materials_finishings_pkey PRIMARY KEY (id);


--
-- Name: materials_impression_types_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_impression_types
    ADD CONSTRAINT materials_impression_types_pkey PRIMARY KEY (id);


--
-- Name: materials_interior_colors_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_interior_colors
    ADD CONSTRAINT materials_interior_colors_pkey PRIMARY KEY (id);


--
-- Name: materials_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- Name: materials_resistances_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials_resistances
    ADD CONSTRAINT materials_resistances_pkey PRIMARY KEY (id);


--
-- Name: movements_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY movements
    ADD CONSTRAINT movements_pkey PRIMARY KEY (id);


--
-- Name: orders_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: orders_users_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY orders_users
    ADD CONSTRAINT orders_users_pkey PRIMARY KEY (id);


--
-- Name: pacs_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY pacs
    ADD CONSTRAINT pacs_pkey PRIMARY KEY (id);


--
-- Name: payment_conditions_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY payment_conditions
    ADD CONSTRAINT payment_conditions_pkey PRIMARY KEY (id);


--
-- Name: payment_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY payment_forms
    ADD CONSTRAINT payment_forms_pkey PRIMARY KEY (id);


--
-- Name: payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY payment_methods
    ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (id);


--
-- Name: payments_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: pending_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY pending_movements
    ADD CONSTRAINT pending_movements_pkey PRIMARY KEY (id);


--
-- Name: pos_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY pos_entries
    ADD CONSTRAINT pos_entries_pkey PRIMARY KEY (id);


--
-- Name: product_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY product_requests
    ADD CONSTRAINT product_requests_pkey PRIMARY KEY (id);


--
-- Name: product_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY product_sales
    ADD CONSTRAINT product_sales_pkey PRIMARY KEY (id);


--
-- Name: product_types_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY product_types
    ADD CONSTRAINT product_types_pkey PRIMARY KEY (id);


--
-- Name: production_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY production_orders
    ADD CONSTRAINT production_orders_pkey PRIMARY KEY (id);


--
-- Name: production_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY production_requests
    ADD CONSTRAINT production_requests_pkey PRIMARY KEY (id);


--
-- Name: products_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: prospect_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY prospect_sales
    ADD CONSTRAINT prospect_sales_pkey PRIMARY KEY (id);


--
-- Name: prospects_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY prospects
    ADD CONSTRAINT prospects_pkey PRIMARY KEY (id);


--
-- Name: relation_types_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY relation_types
    ADD CONSTRAINT relation_types_pkey PRIMARY KEY (id);


--
-- Name: request_users_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY request_users
    ADD CONSTRAINT request_users_pkey PRIMARY KEY (id);


--
-- Name: requests_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: resistances_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY resistances
    ADD CONSTRAINT resistances_pkey PRIMARY KEY (id);


--
-- Name: return_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY return_tickets
    ADD CONSTRAINT return_tickets_pkey PRIMARY KEY (id);


--
-- Name: roles_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: rows_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY rows
    ADD CONSTRAINT rows_pkey PRIMARY KEY (id);


--
-- Name: sales_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY sales_movements
    ADD CONSTRAINT sales_movements_pkey PRIMARY KEY (id);


--
-- Name: sales_targets_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY sales_targets
    ADD CONSTRAINT sales_targets_pkey PRIMARY KEY (id);


--
-- Name: sat_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY sat_keys
    ADD CONSTRAINT sat_keys_pkey PRIMARY KEY (id);


--
-- Name: sat_unit_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY sat_unit_keys
    ADD CONSTRAINT sat_unit_keys_pkey PRIMARY KEY (id);


--
-- Name: sat_zipcodes_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY sat_zipcodes
    ADD CONSTRAINT sat_zipcodes_pkey PRIMARY KEY (id);


--
-- Name: service_offereds_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY service_offereds
    ADD CONSTRAINT service_offereds_pkey PRIMARY KEY (id);


--
-- Name: service_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY service_sales
    ADD CONSTRAINT service_sales_pkey PRIMARY KEY (id);


--
-- Name: services_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: store_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY store_movements
    ADD CONSTRAINT store_movements_pkey PRIMARY KEY (id);


--
-- Name: store_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY store_sales
    ADD CONSTRAINT store_sales_pkey PRIMARY KEY (id);


--
-- Name: store_types_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY store_types
    ADD CONSTRAINT store_types_pkey PRIMARY KEY (id);


--
-- Name: store_use_inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY store_use_inventories
    ADD CONSTRAINT store_use_inventories_pkey PRIMARY KEY (id);


--
-- Name: stores_inventories_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY stores_inventories
    ADD CONSTRAINT stores_inventories_pkey PRIMARY KEY (id);


--
-- Name: stores_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- Name: stores_suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY stores_suppliers
    ADD CONSTRAINT stores_suppliers_pkey PRIMARY KEY (id);


--
-- Name: stores_warehouse_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY stores_warehouse_entries
    ADD CONSTRAINT stores_warehouse_entries_pkey PRIMARY KEY (id);


--
-- Name: suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: tax_regimes_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY tax_regimes
    ADD CONSTRAINT tax_regimes_pkey PRIMARY KEY (id);


--
-- Name: taxes_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY taxes
    ADD CONSTRAINT taxes_pkey PRIMARY KEY (id);


--
-- Name: temporal_numbers_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY temporal_numbers
    ADD CONSTRAINT temporal_numbers_pkey PRIMARY KEY (id);


--
-- Name: terminals_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY terminals
    ADD CONSTRAINT terminals_pkey PRIMARY KEY (id);


--
-- Name: tickets_children_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY tickets_children
    ADD CONSTRAINT tickets_children_pkey PRIMARY KEY (id);


--
-- Name: tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: type_of_bills_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY type_of_bills
    ADD CONSTRAINT type_of_bills_pkey PRIMARY KEY (id);


--
-- Name: units_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: user_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY user_requests
    ADD CONSTRAINT user_requests_pkey PRIMARY KEY (id);


--
-- Name: user_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY user_sales
    ADD CONSTRAINT user_sales_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: warehouse_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY warehouse_entries
    ADD CONSTRAINT warehouse_entries_pkey PRIMARY KEY (id);


--
-- Name: warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: withdrawals_pkey; Type: CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY withdrawals
    ADD CONSTRAINT withdrawals_pkey PRIMARY KEY (id);


--
-- Name: index_bank_balances_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bank_balances_on_business_unit_id ON bank_balances USING btree (business_unit_id);


--
-- Name: index_bank_balances_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bank_balances_on_store_id ON bank_balances USING btree (store_id);


--
-- Name: index_bill_receiveds_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bill_receiveds_on_business_unit_id ON bill_receiveds USING btree (business_unit_id);


--
-- Name: index_bill_receiveds_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bill_receiveds_on_product_id ON bill_receiveds USING btree (product_id);


--
-- Name: index_bill_receiveds_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bill_receiveds_on_store_id ON bill_receiveds USING btree (store_id);


--
-- Name: index_bill_receiveds_on_supplier_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bill_receiveds_on_supplier_id ON bill_receiveds USING btree (supplier_id);


--
-- Name: index_bill_sales_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bill_sales_on_business_unit_id ON bill_sales USING btree (business_unit_id);


--
-- Name: index_bill_sales_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bill_sales_on_store_id ON bill_sales USING btree (store_id);


--
-- Name: index_billing_addresses_on_tax_regime_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_billing_addresses_on_tax_regime_id ON billing_addresses USING btree (tax_regime_id);


--
-- Name: index_bills_children_on_bill_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_children_on_bill_id ON bills_children USING btree (bill_id);


--
-- Name: index_bills_children_on_children_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_children_on_children_id ON bills_children USING btree (children_id);


--
-- Name: index_bills_on_cfdi_use_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_cfdi_use_id ON bills USING btree (cfdi_use_id);


--
-- Name: index_bills_on_country_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_country_id ON bills USING btree (country_id);


--
-- Name: index_bills_on_currency_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_currency_id ON bills USING btree (currency_id);


--
-- Name: index_bills_on_issuing_company_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_issuing_company_id ON bills USING btree (issuing_company_id);


--
-- Name: index_bills_on_pac_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_pac_id ON bills USING btree (pac_id);


--
-- Name: index_bills_on_parent_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_parent_id ON bills USING btree (parent_id);


--
-- Name: index_bills_on_payment_form_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_payment_form_id ON bills USING btree (payment_form_id);


--
-- Name: index_bills_on_payment_method_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_payment_method_id ON bills USING btree (payment_method_id);


--
-- Name: index_bills_on_prospect_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_prospect_id ON bills USING btree (prospect_id);


--
-- Name: index_bills_on_receiving_company_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_receiving_company_id ON bills USING btree (receiving_company_id);


--
-- Name: index_bills_on_relation_type_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_relation_type_id ON bills USING btree (relation_type_id);


--
-- Name: index_bills_on_sat_zipcode_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_sat_zipcode_id ON bills USING btree (sat_zipcode_id);


--
-- Name: index_bills_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_store_id ON bills USING btree (store_id);


--
-- Name: index_bills_on_tax_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_tax_id ON bills USING btree (tax_id);


--
-- Name: index_bills_on_tax_regime_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_tax_regime_id ON bills USING btree (tax_regime_id);


--
-- Name: index_bills_on_type_of_bill_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_type_of_bill_id ON bills USING btree (type_of_bill_id);


--
-- Name: index_business_group_sales_on_business_group_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_business_group_sales_on_business_group_id ON business_group_sales USING btree (business_group_id);


--
-- Name: index_business_groups_suppliers_on_business_group_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_business_groups_suppliers_on_business_group_id ON business_groups_suppliers USING btree (business_group_id);


--
-- Name: index_business_groups_suppliers_on_supplier_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_business_groups_suppliers_on_supplier_id ON business_groups_suppliers USING btree (supplier_id);


--
-- Name: index_business_unit_sales_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_business_unit_sales_on_business_unit_id ON business_unit_sales USING btree (business_unit_id);


--
-- Name: index_business_units_on_billing_address_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_business_units_on_billing_address_id ON business_units USING btree (billing_address_id);


--
-- Name: index_business_units_on_business_group_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_business_units_on_business_group_id ON business_units USING btree (business_group_id);


--
-- Name: index_business_units_suppliers_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_business_units_suppliers_on_business_unit_id ON business_units_suppliers USING btree (business_unit_id);


--
-- Name: index_business_units_suppliers_on_supplier_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_business_units_suppliers_on_supplier_id ON business_units_suppliers USING btree (supplier_id);


--
-- Name: index_carriers_on_delivery_address_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_carriers_on_delivery_address_id ON carriers USING btree (delivery_address_id);


--
-- Name: index_cash_registers_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_cash_registers_on_store_id ON cash_registers USING btree (store_id);


--
-- Name: index_change_tickets_on_bill_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_change_tickets_on_bill_id ON change_tickets USING btree (bill_id);


--
-- Name: index_change_tickets_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_change_tickets_on_store_id ON change_tickets USING btree (store_id);


--
-- Name: index_change_tickets_on_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_change_tickets_on_ticket_id ON change_tickets USING btree (ticket_id);


--
-- Name: index_delivery_attempts_on_driver_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_delivery_attempts_on_driver_id ON delivery_attempts USING btree (driver_id);


--
-- Name: index_delivery_attempts_on_movement_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_delivery_attempts_on_movement_id ON delivery_attempts USING btree (movement_id);


--
-- Name: index_delivery_attempts_on_product_request_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_delivery_attempts_on_product_request_id ON delivery_attempts USING btree (product_request_id);


--
-- Name: index_delivery_attempts_on_receiver_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_delivery_attempts_on_receiver_id ON delivery_attempts USING btree (receiver_id);


--
-- Name: index_delivery_packages_on_delivery_attempt_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_delivery_packages_on_delivery_attempt_id ON delivery_packages USING btree (delivery_attempt_id);


--
-- Name: index_delivery_packages_on_order_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_delivery_packages_on_order_id ON delivery_packages USING btree (order_id);


--
-- Name: index_delivery_services_on_service_offered_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_delivery_services_on_service_offered_id ON delivery_services USING btree (service_offered_id);


--
-- Name: index_deposits_on_cash_register_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_deposits_on_cash_register_id ON deposits USING btree (cash_register_id);


--
-- Name: index_deposits_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_deposits_on_store_id ON deposits USING btree (store_id);


--
-- Name: index_deposits_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_deposits_on_user_id ON deposits USING btree (user_id);


--
-- Name: index_design_request_users_on_design_request_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_design_request_users_on_design_request_id ON design_request_users USING btree (design_request_id);


--
-- Name: index_design_request_users_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_design_request_users_on_user_id ON design_request_users USING btree (user_id);


--
-- Name: index_design_requests_on_request_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_design_requests_on_request_id ON design_requests USING btree (request_id);


--
-- Name: index_discount_rules_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_discount_rules_on_business_unit_id ON discount_rules USING btree (business_unit_id);


--
-- Name: index_discount_rules_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_discount_rules_on_store_id ON discount_rules USING btree (store_id);


--
-- Name: index_discount_rules_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_discount_rules_on_user_id ON discount_rules USING btree (user_id);


--
-- Name: index_documents_on_design_request_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_documents_on_design_request_id ON documents USING btree (design_request_id);


--
-- Name: index_documents_on_request_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_documents_on_request_id ON documents USING btree (request_id);


--
-- Name: index_estimate_docs_on_prospect_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_estimate_docs_on_prospect_id ON estimate_docs USING btree (prospect_id);


--
-- Name: index_estimate_docs_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_estimate_docs_on_store_id ON estimate_docs USING btree (store_id);


--
-- Name: index_estimate_docs_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_estimate_docs_on_user_id ON estimate_docs USING btree (user_id);


--
-- Name: index_estimates_on_estimate_doc_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_estimates_on_estimate_doc_id ON estimates USING btree (estimate_doc_id);


--
-- Name: index_estimates_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_estimates_on_product_id ON estimates USING btree (product_id);


--
-- Name: index_exhibition_inventories_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_exhibition_inventories_on_product_id ON exhibition_inventories USING btree (product_id);


--
-- Name: index_exhibition_inventories_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_exhibition_inventories_on_store_id ON exhibition_inventories USING btree (store_id);


--
-- Name: index_expenses_on_bill_received_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_expenses_on_bill_received_id ON expenses USING btree (bill_received_id);


--
-- Name: index_expenses_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_expenses_on_business_unit_id ON expenses USING btree (business_unit_id);


--
-- Name: index_expenses_on_payment_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_expenses_on_payment_id ON expenses USING btree (payment_id);


--
-- Name: index_expenses_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_expenses_on_store_id ON expenses USING btree (store_id);


--
-- Name: index_expenses_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_expenses_on_user_id ON expenses USING btree (user_id);


--
-- Name: index_images_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_images_on_product_id ON images USING btree (product_id);


--
-- Name: index_inventories_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_inventories_on_product_id ON inventories USING btree (product_id);


--
-- Name: index_material_children_on_children_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_material_children_on_children_id ON material_children USING btree (children_id);


--
-- Name: index_material_children_on_material_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_material_children_on_material_id ON material_children USING btree (material_id);


--
-- Name: index_materials_design_likes_on_design_like_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_design_likes_on_design_like_id ON materials_design_likes USING btree (design_like_id);


--
-- Name: index_materials_design_likes_on_material_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_design_likes_on_material_id ON materials_design_likes USING btree (material_id);


--
-- Name: index_materials_exterior_colors_on_exterior_color_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_exterior_colors_on_exterior_color_id ON materials_exterior_colors USING btree (exterior_color_id);


--
-- Name: index_materials_exterior_colors_on_material_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_exterior_colors_on_material_id ON materials_exterior_colors USING btree (material_id);


--
-- Name: index_materials_finishings_on_finishing_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_finishings_on_finishing_id ON materials_finishings USING btree (finishing_id);


--
-- Name: index_materials_finishings_on_material_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_finishings_on_material_id ON materials_finishings USING btree (material_id);


--
-- Name: index_materials_impression_types_on_impression_type_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_impression_types_on_impression_type_id ON materials_impression_types USING btree (impression_type_id);


--
-- Name: index_materials_impression_types_on_material_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_impression_types_on_material_id ON materials_impression_types USING btree (material_id);


--
-- Name: index_materials_interior_colors_on_interior_color_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_interior_colors_on_interior_color_id ON materials_interior_colors USING btree (interior_color_id);


--
-- Name: index_materials_interior_colors_on_material_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_interior_colors_on_material_id ON materials_interior_colors USING btree (material_id);


--
-- Name: index_materials_on_children_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_on_children_id ON materials USING btree (children_id);


--
-- Name: index_materials_on_parent_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_on_parent_id ON materials USING btree (parent_id);


--
-- Name: index_materials_resistances_on_material_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_resistances_on_material_id ON materials_resistances USING btree (material_id);


--
-- Name: index_materials_resistances_on_resistance_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_materials_resistances_on_resistance_id ON materials_resistances USING btree (resistance_id);


--
-- Name: index_movements_on_bill_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_bill_id ON movements USING btree (bill_id);


--
-- Name: index_movements_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_business_unit_id ON movements USING btree (business_unit_id);


--
-- Name: index_movements_on_buyer_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_buyer_user_id ON movements USING btree (buyer_user_id);


--
-- Name: index_movements_on_discount_rule_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_discount_rule_id ON movements USING btree (discount_rule_id);


--
-- Name: index_movements_on_entry_movement_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_entry_movement_id ON movements USING btree (entry_movement_id);


--
-- Name: index_movements_on_order_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_order_id ON movements USING btree (order_id);


--
-- Name: index_movements_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_product_id ON movements USING btree (product_id);


--
-- Name: index_movements_on_product_request_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_product_request_id ON movements USING btree (product_request_id);


--
-- Name: index_movements_on_prospect_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_prospect_id ON movements USING btree (prospect_id);


--
-- Name: index_movements_on_seller_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_seller_user_id ON movements USING btree (seller_user_id);


--
-- Name: index_movements_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_store_id ON movements USING btree (store_id);


--
-- Name: index_movements_on_supplier_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_supplier_id ON movements USING btree (supplier_id);


--
-- Name: index_movements_on_tax_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_tax_id ON movements USING btree (tax_id);


--
-- Name: index_movements_on_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_ticket_id ON movements USING btree (ticket_id);


--
-- Name: index_movements_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_movements_on_user_id ON movements USING btree (user_id);


--
-- Name: index_orders_on_bill_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_orders_on_bill_id ON orders USING btree (bill_id);


--
-- Name: index_orders_on_billing_address_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_orders_on_billing_address_id ON orders USING btree (billing_address_id);


--
-- Name: index_orders_on_carrier_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_orders_on_carrier_id ON orders USING btree (carrier_id);


--
-- Name: index_orders_on_delivery_address_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_orders_on_delivery_address_id ON orders USING btree (delivery_address_id);


--
-- Name: index_orders_on_delivery_attempt_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_orders_on_delivery_attempt_id ON orders USING btree (delivery_attempt_id);


--
-- Name: index_orders_on_prospect_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_orders_on_prospect_id ON orders USING btree (prospect_id);


--
-- Name: index_orders_on_request_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_orders_on_request_id ON orders USING btree (request_id);


--
-- Name: index_orders_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_orders_on_store_id ON orders USING btree (store_id);


--
-- Name: index_orders_users_on_order_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_orders_users_on_order_id ON orders_users USING btree (order_id);


--
-- Name: index_orders_users_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_orders_users_on_user_id ON orders_users USING btree (user_id);


--
-- Name: index_payments_on_bank_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_payments_on_bank_id ON payments USING btree (bank_id);


--
-- Name: index_payments_on_bill_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_payments_on_bill_id ON payments USING btree (bill_id);


--
-- Name: index_payments_on_bill_received_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_payments_on_bill_received_id ON payments USING btree (bill_received_id);


--
-- Name: index_payments_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_payments_on_business_unit_id ON payments USING btree (business_unit_id);


--
-- Name: index_payments_on_order_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_payments_on_order_id ON payments USING btree (order_id);


--
-- Name: index_payments_on_payment_form_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_payments_on_payment_form_id ON payments USING btree (payment_form_id);


--
-- Name: index_payments_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_payments_on_store_id ON payments USING btree (store_id);


--
-- Name: index_payments_on_supplier_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_payments_on_supplier_id ON payments USING btree (supplier_id);


--
-- Name: index_payments_on_terminal_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_payments_on_terminal_id ON payments USING btree (terminal_id);


--
-- Name: index_payments_on_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_payments_on_ticket_id ON payments USING btree (ticket_id);


--
-- Name: index_payments_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_payments_on_user_id ON payments USING btree (user_id);


--
-- Name: index_pending_movements_on_bill_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_bill_id ON pending_movements USING btree (bill_id);


--
-- Name: index_pending_movements_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_business_unit_id ON pending_movements USING btree (business_unit_id);


--
-- Name: index_pending_movements_on_buyer_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_buyer_user_id ON pending_movements USING btree (buyer_user_id);


--
-- Name: index_pending_movements_on_discount_rule_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_discount_rule_id ON pending_movements USING btree (discount_rule_id);


--
-- Name: index_pending_movements_on_order_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_order_id ON pending_movements USING btree (order_id);


--
-- Name: index_pending_movements_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_product_id ON pending_movements USING btree (product_id);


--
-- Name: index_pending_movements_on_product_request_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_product_request_id ON pending_movements USING btree (product_request_id);


--
-- Name: index_pending_movements_on_prospect_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_prospect_id ON pending_movements USING btree (prospect_id);


--
-- Name: index_pending_movements_on_seller_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_seller_user_id ON pending_movements USING btree (seller_user_id);


--
-- Name: index_pending_movements_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_store_id ON pending_movements USING btree (store_id);


--
-- Name: index_pending_movements_on_supplier_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_supplier_id ON pending_movements USING btree (supplier_id);


--
-- Name: index_pending_movements_on_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_ticket_id ON pending_movements USING btree (ticket_id);


--
-- Name: index_pending_movements_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pending_movements_on_user_id ON pending_movements USING btree (user_id);


--
-- Name: index_pos_entries_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pos_entries_on_product_id ON pos_entries USING btree (product_id);


--
-- Name: index_pos_entries_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_pos_entries_on_store_id ON pos_entries USING btree (store_id);


--
-- Name: index_product_requests_on_order_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_product_requests_on_order_id ON product_requests USING btree (order_id);


--
-- Name: index_product_requests_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_product_requests_on_product_id ON product_requests USING btree (product_id);


--
-- Name: index_product_sales_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_product_sales_on_business_unit_id ON product_sales USING btree (business_unit_id);


--
-- Name: index_product_sales_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_product_sales_on_product_id ON product_sales USING btree (product_id);


--
-- Name: index_product_sales_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_product_sales_on_store_id ON product_sales USING btree (store_id);


--
-- Name: index_production_orders_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_production_orders_on_user_id ON production_orders USING btree (user_id);


--
-- Name: index_production_requests_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_production_requests_on_product_id ON production_requests USING btree (product_id);


--
-- Name: index_production_requests_on_production_order_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_production_requests_on_production_order_id ON production_requests USING btree (production_order_id);


--
-- Name: index_products_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_products_on_business_unit_id ON products USING btree (business_unit_id);


--
-- Name: index_products_on_child_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_products_on_child_id ON products USING btree (child_id);


--
-- Name: index_products_on_parent_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_products_on_parent_id ON products USING btree (parent_id);


--
-- Name: index_products_on_sat_key_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_products_on_sat_key_id ON products USING btree (sat_key_id);


--
-- Name: index_products_on_sat_unit_key_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_products_on_sat_unit_key_id ON products USING btree (sat_unit_key_id);


--
-- Name: index_products_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_products_on_store_id ON products USING btree (store_id);


--
-- Name: index_products_on_supplier_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_products_on_supplier_id ON products USING btree (supplier_id);


--
-- Name: index_products_on_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_products_on_unit_id ON products USING btree (unit_id);


--
-- Name: index_products_on_warehouse_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_products_on_warehouse_id ON products USING btree (warehouse_id);


--
-- Name: index_prospect_sales_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_prospect_sales_on_business_unit_id ON prospect_sales USING btree (business_unit_id);


--
-- Name: index_prospect_sales_on_prospect_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_prospect_sales_on_prospect_id ON prospect_sales USING btree (prospect_id);


--
-- Name: index_prospect_sales_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_prospect_sales_on_store_id ON prospect_sales USING btree (store_id);


--
-- Name: index_prospects_on_billing_address_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_prospects_on_billing_address_id ON prospects USING btree (billing_address_id);


--
-- Name: index_prospects_on_business_group_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_prospects_on_business_group_id ON prospects USING btree (business_group_id);


--
-- Name: index_prospects_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_prospects_on_business_unit_id ON prospects USING btree (business_unit_id);


--
-- Name: index_prospects_on_delivery_address_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_prospects_on_delivery_address_id ON prospects USING btree (delivery_address_id);


--
-- Name: index_prospects_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_prospects_on_store_id ON prospects USING btree (store_id);


--
-- Name: index_prospects_on_store_prospect_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_prospects_on_store_prospect_id ON prospects USING btree (store_prospect_id);


--
-- Name: index_prospects_on_store_type_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_prospects_on_store_type_id ON prospects USING btree (store_type_id);


--
-- Name: index_request_users_on_request_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_request_users_on_request_id ON request_users USING btree (request_id);


--
-- Name: index_request_users_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_request_users_on_user_id ON request_users USING btree (user_id);


--
-- Name: index_requests_on_estimate_doc_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_requests_on_estimate_doc_id ON requests USING btree (estimate_doc_id);


--
-- Name: index_requests_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_requests_on_product_id ON requests USING btree (product_id);


--
-- Name: index_requests_on_prospect_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_requests_on_prospect_id ON requests USING btree (prospect_id);


--
-- Name: index_requests_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_requests_on_store_id ON requests USING btree (store_id);


--
-- Name: index_return_tickets_on_bill_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_return_tickets_on_bill_id ON return_tickets USING btree (bill_id);


--
-- Name: index_return_tickets_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_return_tickets_on_store_id ON return_tickets USING btree (store_id);


--
-- Name: index_return_tickets_on_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_return_tickets_on_ticket_id ON return_tickets USING btree (ticket_id);


--
-- Name: index_rows_on_bill_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_rows_on_bill_id ON rows USING btree (bill_id);


--
-- Name: index_sales_movements_on_movement_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_sales_movements_on_movement_id ON sales_movements USING btree (movement_id);


--
-- Name: index_sales_movements_on_sales_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_sales_movements_on_sales_id ON sales_movements USING btree (sales_id);


--
-- Name: index_sales_targets_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_sales_targets_on_store_id ON sales_targets USING btree (store_id);


--
-- Name: index_service_offereds_on_service_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_service_offereds_on_service_id ON service_offereds USING btree (service_id);


--
-- Name: index_service_offereds_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_service_offereds_on_store_id ON service_offereds USING btree (store_id);


--
-- Name: index_service_offereds_on_tax_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_service_offereds_on_tax_id ON service_offereds USING btree (tax_id);


--
-- Name: index_service_offereds_on_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_service_offereds_on_ticket_id ON service_offereds USING btree (ticket_id);


--
-- Name: index_service_sales_on_service_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_service_sales_on_service_id ON service_sales USING btree (service_id);


--
-- Name: index_service_sales_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_service_sales_on_store_id ON service_sales USING btree (store_id);


--
-- Name: index_services_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_services_on_business_unit_id ON services USING btree (business_unit_id);


--
-- Name: index_services_on_sat_key_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_services_on_sat_key_id ON services USING btree (sat_key_id);


--
-- Name: index_services_on_sat_unit_key_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_services_on_sat_unit_key_id ON services USING btree (sat_unit_key_id);


--
-- Name: index_services_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_services_on_store_id ON services USING btree (store_id);


--
-- Name: index_store_movements_on_bill_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_movements_on_bill_id ON store_movements USING btree (bill_id);


--
-- Name: index_store_movements_on_order_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_movements_on_order_id ON store_movements USING btree (order_id);


--
-- Name: index_store_movements_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_movements_on_product_id ON store_movements USING btree (product_id);


--
-- Name: index_store_movements_on_product_request_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_movements_on_product_request_id ON store_movements USING btree (product_request_id);


--
-- Name: index_store_movements_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_movements_on_store_id ON store_movements USING btree (store_id);


--
-- Name: index_store_movements_on_supplier_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_movements_on_supplier_id ON store_movements USING btree (supplier_id);


--
-- Name: index_store_movements_on_tax_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_movements_on_tax_id ON store_movements USING btree (tax_id);


--
-- Name: index_store_movements_on_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_movements_on_ticket_id ON store_movements USING btree (ticket_id);


--
-- Name: index_store_sales_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_sales_on_store_id ON store_sales USING btree (store_id);


--
-- Name: index_store_use_inventories_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_use_inventories_on_product_id ON store_use_inventories USING btree (product_id);


--
-- Name: index_store_use_inventories_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_use_inventories_on_store_id ON store_use_inventories USING btree (store_id);


--
-- Name: index_stores_inventories_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_inventories_on_product_id ON stores_inventories USING btree (product_id);


--
-- Name: index_stores_inventories_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_inventories_on_store_id ON stores_inventories USING btree (store_id);


--
-- Name: index_stores_on_business_group_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_on_business_group_id ON stores USING btree (business_group_id);


--
-- Name: index_stores_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_on_business_unit_id ON stores USING btree (business_unit_id);


--
-- Name: index_stores_on_cost_type_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_on_cost_type_id ON stores USING btree (cost_type_id);


--
-- Name: index_stores_on_delivery_address_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_on_delivery_address_id ON stores USING btree (delivery_address_id);


--
-- Name: index_stores_on_store_type_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_on_store_type_id ON stores USING btree (store_type_id);


--
-- Name: index_stores_suppliers_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_suppliers_on_store_id ON stores_suppliers USING btree (store_id);


--
-- Name: index_stores_suppliers_on_supplier_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_suppliers_on_supplier_id ON stores_suppliers USING btree (supplier_id);


--
-- Name: index_stores_warehouse_entries_on_movement_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_warehouse_entries_on_movement_id ON stores_warehouse_entries USING btree (movement_id);


--
-- Name: index_stores_warehouse_entries_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_warehouse_entries_on_product_id ON stores_warehouse_entries USING btree (product_id);


--
-- Name: index_stores_warehouse_entries_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_warehouse_entries_on_store_id ON stores_warehouse_entries USING btree (store_id);


--
-- Name: index_stores_warehouse_entries_on_store_movement_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_stores_warehouse_entries_on_store_movement_id ON stores_warehouse_entries USING btree (store_movement_id);


--
-- Name: index_suppliers_on_delivery_address_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_suppliers_on_delivery_address_id ON suppliers USING btree (delivery_address_id);


--
-- Name: index_suppliers_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_suppliers_on_store_id ON suppliers USING btree (store_id);


--
-- Name: index_temporal_numbers_on_business_group_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_temporal_numbers_on_business_group_id ON temporal_numbers USING btree (business_group_id);


--
-- Name: index_temporal_numbers_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_temporal_numbers_on_store_id ON temporal_numbers USING btree (store_id);


--
-- Name: index_terminals_on_bank_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_terminals_on_bank_id ON terminals USING btree (bank_id);


--
-- Name: index_terminals_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_terminals_on_store_id ON terminals USING btree (store_id);


--
-- Name: index_tickets_children_on_children_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_tickets_children_on_children_id ON tickets_children USING btree (children_id);


--
-- Name: index_tickets_children_on_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_tickets_children_on_ticket_id ON tickets_children USING btree (ticket_id);


--
-- Name: index_tickets_on_bill_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_tickets_on_bill_id ON tickets USING btree (bill_id);


--
-- Name: index_tickets_on_cash_register_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_tickets_on_cash_register_id ON tickets USING btree (cash_register_id);


--
-- Name: index_tickets_on_cfdi_use_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_tickets_on_cfdi_use_id ON tickets USING btree (cfdi_use_id);


--
-- Name: index_tickets_on_parent_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_tickets_on_parent_id ON tickets USING btree (parent_id);


--
-- Name: index_tickets_on_prospect_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_tickets_on_prospect_id ON tickets USING btree (prospect_id);


--
-- Name: index_tickets_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_tickets_on_store_id ON tickets USING btree (store_id);


--
-- Name: index_tickets_on_tax_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_tickets_on_tax_id ON tickets USING btree (tax_id);


--
-- Name: index_tickets_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_tickets_on_user_id ON tickets USING btree (user_id);


--
-- Name: index_user_requests_on_request_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_user_requests_on_request_id ON user_requests USING btree (request_id);


--
-- Name: index_user_requests_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_user_requests_on_user_id ON user_requests USING btree (user_id);


--
-- Name: index_user_sales_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_user_sales_on_user_id ON user_sales USING btree (user_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE UNIQUE INDEX index_users_on_email ON users USING btree (email);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON users USING btree (reset_password_token);


--
-- Name: index_users_on_role_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_users_on_role_id ON users USING btree (role_id);


--
-- Name: index_users_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_users_on_store_id ON users USING btree (store_id);


--
-- Name: index_warehouse_entries_on_movement_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_warehouse_entries_on_movement_id ON warehouse_entries USING btree (movement_id);


--
-- Name: index_warehouse_entries_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_warehouse_entries_on_product_id ON warehouse_entries USING btree (product_id);


--
-- Name: index_warehouse_entries_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_warehouse_entries_on_store_id ON warehouse_entries USING btree (store_id);


--
-- Name: index_warehouses_on_business_group_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_warehouses_on_business_group_id ON warehouses USING btree (business_group_id);


--
-- Name: index_warehouses_on_business_unit_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_warehouses_on_business_unit_id ON warehouses USING btree (business_unit_id);


--
-- Name: index_warehouses_on_delivery_address_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_warehouses_on_delivery_address_id ON warehouses USING btree (delivery_address_id);


--
-- Name: index_warehouses_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_warehouses_on_store_id ON warehouses USING btree (store_id);


--
-- Name: index_withdrawals_on_cash_register_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_withdrawals_on_cash_register_id ON withdrawals USING btree (cash_register_id);


--
-- Name: index_withdrawals_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_withdrawals_on_store_id ON withdrawals USING btree (store_id);


--
-- Name: index_withdrawals_on_user_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_withdrawals_on_user_id ON withdrawals USING btree (user_id);


--
-- Name: unique_schema_migrations; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE UNIQUE INDEX unique_schema_migrations ON schema_migrations USING btree (version);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

