--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.8
-- Dumped by pg_dump version 9.5.8

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
    updated_at timestamp without time zone NOT NULL
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
    tax_regime_id integer
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
    initial_price double precision,
    discount_applied double precision,
    price_before_taxes double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    type_of_bill character varying,
    prospect_id integer,
    classification character varying,
    amount double precision,
    quantity integer,
    pdf character varying,
    xml character varying,
    issuing_company_id integer,
    receiving_company_id integer,
    store_id integer,
    sequence character varying,
    folio character varying,
    expedition_zip_id integer,
    payment_condition_id integer,
    payment_method_id integer,
    payment_form_id integer,
    tax_regime_id integer,
    cfdi_use_id integer,
    tax_id integer,
    pac_id integer,
    fiscal_folio character varying,
    digital_stamp character varying,
    sat_stamp character varying,
    original_chain character varying,
    relation_type_id integer,
    child_bills_id integer,
    parent_id integer,
    references_field character varying,
    type_of_bill_id integer,
    certificate character varying,
    currency_id integer,
    id_trib_reg_num character varying,
    confirmation_key character varying,
    exchange_rate double precision,
    country_id integer,
    automatic_discount_applied double precision,
    manual_discount_applied double precision,
    taxes_transferred double precision,
    taxes_witheld double precision
);


ALTER TABLE bills OWNER TO faviovelez;

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
    sales_amount double precision,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    sales_quantity integer,
    discount double precision
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
    sales_amount double precision,
    sales_quantity integer,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    month integer,
    year integer,
    discount double precision
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
    cash_number integer
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
    receivers_zipcode character varying
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
    payment_id integer
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
    material_id integer,
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
    product_id integer
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
-- Name: interior_colors; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE interior_colors (
    id integer NOT NULL,
    name character varying,
    material_id integer,
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
-- Name: materials; Type: TABLE; Schema: public; Owner: faviovelez
--

CREATE TABLE materials (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE materials OWNER TO faviovelez;

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
    amount double precision,
    seller_user_id integer,
    buyer_user_id integer,
    rule_could_be boolean DEFAULT false,
    ticket_id integer,
    tax_id integer,
    taxes double precision,
    total_cost double precision
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
    delivery_attempt_id integer
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
    active boolean DEFAULT true
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
    payment_id character varying
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
    amount double precision,
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
    credit_days integer
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
    total_cost double precision
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
    sales_amount double precision,
    sales_quantity integer,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    product_id integer,
    month integer,
    year integer,
    store_id integer,
    business_unit_id integer,
    discount double precision
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
    unit_id integer
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
    sales_amount double precision,
    sales_quantity integer,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    month integer,
    year integer,
    store_id integer,
    business_unit_id integer,
    discount double precision
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
    credit_days integer
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
    inner_height character varying,
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
    price_selected integer
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
    amount double precision,
    service_type character varying,
    return_ticket_id integer,
    change_ticket_id integer,
    tax_id integer,
    taxes double precision,
    cost double precision,
    ticket_id integer,
    total_cost double precision,
    quantity integer,
    discount_reason character varying
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
    delivery_company character varying
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
    amount double precision,
    return_ticket_id integer,
    change_ticket_id integer,
    tax_id integer,
    taxes double precision,
    cost double precision,
    supplier_id integer,
    product_request_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    total_cost double precision,
    discount_reason character varying
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
    sales_amount double precision,
    sales_quantity integer,
    cost double precision,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    discount double precision
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
    last_bill integer DEFAULT 0
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
    manual_price_update boolean DEFAULT false
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
    quantity integer,
    movement_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    retail_units_per_unit integer,
    units_used integer,
    store_movement_id integer
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
    credit_comission double precision
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
    comments character varying
);


ALTER TABLE tickets OWNER TO faviovelez;

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
    role_id integer
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

ALTER TABLE ONLY interior_colors ALTER COLUMN id SET DEFAULT nextval('interior_colors_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY inventories ALTER COLUMN id SET DEFAULT nextval('inventories_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY materials ALTER COLUMN id SET DEFAULT nextval('materials_id_seq'::regclass);


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
-- Data for Name: bank_balances; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY bank_balances (id, balance, store_id, business_unit_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: bank_balances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('bank_balances_id_seq', 1, false);


--
-- Data for Name: banks; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY banks (id, name, rfc, created_at, updated_at) FROM stdin;
\.


--
-- Name: banks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('banks_id_seq', 1, false);


--
-- Data for Name: bill_receiveds; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY bill_receiveds (id, folio, date_of_bill, subtotal, taxes_rate, taxes, total_amount, supplier_id, product_id, payment_day, payment_complete, payment_on_time, created_at, updated_at, business_unit_id, store_id) FROM stdin;
\.


--
-- Name: bill_receiveds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('bill_receiveds_id_seq', 1, false);


--
-- Data for Name: bill_sales; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY bill_sales (id, business_unit_id, store_id, sales_quantity, amount, month, year, created_at, updated_at, discount) FROM stdin;
\.


--
-- Name: bill_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('bill_sales_id_seq', 1, false);


--
-- Data for Name: billing_addresses; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY billing_addresses (id, type_of_person, business_name, rfc, street, exterior_number, interior_number, zipcode, neighborhood, city, state, country, created_at, updated_at, tax_regime_id) FROM stdin;
\.


--
-- Name: billing_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('billing_addresses_id_seq', 1, false);


--
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY bills (id, status, initial_price, discount_applied, price_before_taxes, created_at, updated_at, type_of_bill, prospect_id, classification, amount, quantity, pdf, xml, issuing_company_id, receiving_company_id, store_id, sequence, folio, expedition_zip_id, payment_condition_id, payment_method_id, payment_form_id, tax_regime_id, cfdi_use_id, tax_id, pac_id, fiscal_folio, digital_stamp, sat_stamp, original_chain, relation_type_id, child_bills_id, parent_id, references_field, type_of_bill_id, certificate, currency_id, id_trib_reg_num, confirmation_key, exchange_rate, country_id, automatic_discount_applied, manual_discount_applied, taxes_transferred, taxes_witheld) FROM stdin;
\.


--
-- Name: bills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('bills_id_seq', 1, false);


--
-- Data for Name: business_group_sales; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY business_group_sales (id, business_group_id, month, year, sales_amount, cost, created_at, updated_at, sales_quantity, discount) FROM stdin;
\.


--
-- Name: business_group_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('business_group_sales_id_seq', 1, false);


--
-- Data for Name: business_groups; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY business_groups (id, name, created_at, updated_at, business_group_type) FROM stdin;
\.


--
-- Name: business_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('business_groups_id_seq', 1, false);


--
-- Data for Name: business_groups_suppliers; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY business_groups_suppliers (id, business_group_id, supplier_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: business_groups_suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('business_groups_suppliers_id_seq', 1, false);


--
-- Data for Name: business_unit_sales; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY business_unit_sales (id, business_unit_id, sales_amount, sales_quantity, cost, created_at, updated_at, month, year, discount) FROM stdin;
\.


--
-- Name: business_unit_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('business_unit_sales_id_seq', 1, false);


--
-- Data for Name: business_units; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY business_units (id, name, created_at, updated_at, business_group_id, billing_address_id, current, pending_balance, main) FROM stdin;
\.


--
-- Name: business_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('business_units_id_seq', 1, false);


--
-- Data for Name: business_units_suppliers; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY business_units_suppliers (id, business_unit_id, supplier_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: business_units_suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('business_units_suppliers_id_seq', 1, false);


--
-- Data for Name: carriers; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY carriers (id, name, created_at, updated_at, delivery_address_id) FROM stdin;
\.


--
-- Name: carriers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('carriers_id_seq', 1, false);


--
-- Data for Name: cash_registers; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY cash_registers (id, name, store_id, created_at, updated_at, balance, cash_number) FROM stdin;
\.


--
-- Name: cash_registers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('cash_registers_id_seq', 1, false);


--
-- Data for Name: cfdi_uses; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY cfdi_uses (id, description, created_at, updated_at, key) FROM stdin;
\.


--
-- Name: cfdi_uses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('cfdi_uses_id_seq', 1, false);


--
-- Data for Name: change_tickets; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY change_tickets (id, ticket_id, ticket_number, created_at, updated_at, store_id, bill_id) FROM stdin;
\.


--
-- Name: change_tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('change_tickets_id_seq', 1, false);


--
-- Data for Name: classifications; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY classifications (id, name, created_at, updated_at) FROM stdin;
\.


--
-- Name: classifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('classifications_id_seq', 1, false);


--
-- Data for Name: cost_types; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY cost_types (id, warehouse_cost_type, created_at, updated_at, description) FROM stdin;
\.


--
-- Name: cost_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('cost_types_id_seq', 1, false);


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY countries (id, key, name, created_at, updated_at) FROM stdin;
\.


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('countries_id_seq', 1, false);


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY currencies (id, name, created_at, updated_at, description, decimals) FROM stdin;
\.


--
-- Name: currencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('currencies_id_seq', 1, false);


--
-- Data for Name: delivery_addresses; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY delivery_addresses (id, street, exterior_number, interior_number, zipcode, neighborhood, city, state, country, type_of_address, created_at, updated_at, additional_references, name) FROM stdin;
\.


--
-- Name: delivery_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('delivery_addresses_id_seq', 1, false);


--
-- Data for Name: delivery_attempts; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY delivery_attempts (id, product_request_id, created_at, updated_at, movement_id, driver_id, receiver_id) FROM stdin;
\.


--
-- Name: delivery_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('delivery_attempts_id_seq', 1, false);


--
-- Data for Name: delivery_packages; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY delivery_packages (id, length, width, height, weight, order_id, created_at, updated_at, delivery_attempt_id) FROM stdin;
\.


--
-- Name: delivery_packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('delivery_packages_id_seq', 1, false);


--
-- Data for Name: delivery_services; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY delivery_services (id, sender_name, sender_zipcode, tracking_number, receivers_name, contact_name, street, exterior_number, interior_number, neighborhood, city, state, country, phone, cellphone, email, company, service_offered_id, created_at, updated_at, receivers_zipcode) FROM stdin;
\.


--
-- Name: delivery_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('delivery_services_id_seq', 1, false);


--
-- Data for Name: deposits; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY deposits (id, user_id, store_id, amount, created_at, updated_at, cash_register_id, name) FROM stdin;
\.


--
-- Name: deposits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('deposits_id_seq', 1, false);


--
-- Data for Name: design_costs; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY design_costs (id, complexity, cost, created_at, updated_at) FROM stdin;
\.


--
-- Name: design_costs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('design_costs_id_seq', 1, false);


--
-- Data for Name: design_likes; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY design_likes (id, name, created_at, updated_at) FROM stdin;
\.


--
-- Name: design_likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('design_likes_id_seq', 1, false);


--
-- Data for Name: design_request_users; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY design_request_users (id, design_request_id, user_id) FROM stdin;
\.


--
-- Name: design_request_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('design_request_users_id_seq', 1, false);


--
-- Data for Name: design_requests; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY design_requests (id, design_type, cost, status, authorisation, created_at, updated_at, request_id, description, attachment, notes) FROM stdin;
\.


--
-- Name: design_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('design_requests_id_seq', 1, false);


--
-- Data for Name: discount_rules; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY discount_rules (id, percentage, product_list, prospect_list, initial_date, final_date, user_id, rule, minimum_amount, minimum_quantity, exclusions, active, created_at, updated_at, business_unit_id, store_id, prospect_filter, product_filter, product_all, prospect_all, product_gift, line_filter, material_filter) FROM stdin;
\.


--
-- Name: discount_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('discount_rules_id_seq', 1, false);


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY documents (id, request_id, created_at, updated_at, document_type, design_request_id, document) FROM stdin;
\.


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('documents_id_seq', 1, false);


--
-- Data for Name: estimate_docs; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY estimate_docs (id, prospect_id, user_id, created_at, updated_at, store_id) FROM stdin;
\.


--
-- Name: estimate_docs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('estimate_docs_id_seq', 1, false);


--
-- Data for Name: estimates; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY estimates (id, product_id, quantity, discount, estimate_doc_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: estimates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('estimates_id_seq', 1, false);


--
-- Data for Name: exhibition_inventories; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY exhibition_inventories (id, store_id, product_id, quantity, created_at, updated_at) FROM stdin;
\.


--
-- Name: exhibition_inventories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('exhibition_inventories_id_seq', 1, false);


--
-- Data for Name: expedition_zips; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY expedition_zips (id, zip, created_at, updated_at) FROM stdin;
\.


--
-- Name: expedition_zips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('expedition_zips_id_seq', 1, false);


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY expenses (id, subtotal, taxes_rate, total, store_id, business_unit_id, user_id, bill_received_id, month, year, expense_date, created_at, updated_at, expense_type, taxes, payment_id) FROM stdin;
\.


--
-- Name: expenses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('expenses_id_seq', 1, false);


--
-- Data for Name: exterior_colors; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY exterior_colors (id, name, material_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: exterior_colors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('exterior_colors_id_seq', 1, false);


--
-- Data for Name: finishings; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY finishings (id, name, created_at, updated_at) FROM stdin;
\.


--
-- Name: finishings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('finishings_id_seq', 1, false);


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY images (id, image, created_at, updated_at, product_id) FROM stdin;
\.


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('images_id_seq', 1, false);


--
-- Data for Name: interior_colors; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY interior_colors (id, name, material_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: interior_colors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('interior_colors_id_seq', 1, false);


--
-- Data for Name: inventories; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY inventories (id, product_id, created_at, updated_at, quantity, unique_code, alert, alert_type) FROM stdin;
\.


--
-- Name: inventories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('inventories_id_seq', 1, false);


--
-- Data for Name: materials; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY materials (id, name, created_at, updated_at) FROM stdin;
\.


--
-- Name: materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('materials_id_seq', 1, false);


--
-- Data for Name: materials_resistances; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY materials_resistances (id, material_id, resistance_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: materials_resistances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('materials_resistances_id_seq', 1, false);


--
-- Data for Name: movements; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY movements (id, product_id, quantity, movement_type, created_at, updated_at, order_id, user_id, cost, unique_code, store_id, initial_price, supplier_id, business_unit_id, prospect_id, bill_id, product_request_id, maximum_date, confirm, discount_applied, final_price, automatic_discount, manual_discount, discount_rule_id, amount, seller_user_id, buyer_user_id, rule_could_be, ticket_id, tax_id, taxes, total_cost) FROM stdin;
\.


--
-- Name: movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('movements_id_seq', 1, false);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY orders (id, status, delivery_address_id, created_at, updated_at, category, prospect_id, request_id, billing_address_id, carrier_id, store_id, confirm, delivery_notes, bill_id, delivery_attempt_id) FROM stdin;
\.


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('orders_id_seq', 1, false);


--
-- Data for Name: orders_users; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY orders_users (id, order_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: orders_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('orders_users_id_seq', 1, false);


--
-- Data for Name: pacs; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY pacs (id, name, certificate, created_at, updated_at, active) FROM stdin;
\.


--
-- Name: pacs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('pacs_id_seq', 1, false);


--
-- Data for Name: payment_conditions; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY payment_conditions (id, description, created_at, updated_at) FROM stdin;
\.


--
-- Name: payment_conditions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('payment_conditions_id_seq', 1, false);


--
-- Data for Name: payment_forms; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY payment_forms (id, description, created_at, updated_at, payment_id) FROM stdin;
\.


--
-- Name: payment_forms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('payment_forms_id_seq', 1, false);


--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY payment_methods (id, description, created_at, updated_at, method) FROM stdin;
\.


--
-- Name: payment_methods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('payment_methods_id_seq', 1, false);


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY payments (id, payment_date, amount, bill_received_id, supplier_id, created_at, updated_at, user_id, store_id, business_unit_id, payment_form_id, payment_type, bill_id, terminal_id, ticket_id, operation_number, payment_number, bank_id, credit_days) FROM stdin;
\.


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('payments_id_seq', 1, false);


--
-- Data for Name: pending_movements; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY pending_movements (id, product_id, quantity, created_at, updated_at, order_id, cost, unique_code, store_id, initial_price, supplier_id, movement_type, user_id, business_unit_id, prospect_id, bill_id, product_request_id, maximum_date, discount_applied, final_price, automatic_discount, manual_discount, discount_rule_id, seller_user_id, buyer_user_id, ticket_id, total_cost) FROM stdin;
\.


--
-- Name: pending_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('pending_movements_id_seq', 1, false);


--
-- Data for Name: product_requests; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY product_requests (id, product_id, quantity, status, order_id, urgency_level, maximum_date, created_at, updated_at, armed, surplus, excess) FROM stdin;
\.


--
-- Name: product_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('product_requests_id_seq', 1, false);


--
-- Data for Name: product_sales; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY product_sales (id, sales_amount, sales_quantity, cost, created_at, updated_at, product_id, month, year, store_id, business_unit_id, discount) FROM stdin;
\.


--
-- Name: product_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('product_sales_id_seq', 1, false);


--
-- Data for Name: product_types; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY product_types (id, product_type, created_at, updated_at) FROM stdin;
\.


--
-- Name: product_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('product_types_id_seq', 1, false);


--
-- Data for Name: production_orders; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY production_orders (id, user_id, created_at, updated_at, status) FROM stdin;
\.


--
-- Name: production_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('production_orders_id_seq', 1, false);


--
-- Data for Name: production_requests; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY production_requests (id, product_id, quantity, status, production_order_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: production_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('production_requests_id_seq', 1, false);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY products (id, former_code, unique_code, description, product_type, exterior_material_color, interior_material_color, impression, exterior_color_or_design, main_material, resistance_main_material, inner_length, inner_width, inner_height, outer_length, outer_width, outer_height, design_type, number_of_pieces, accesories_kit, created_at, updated_at, price, bag_length, bag_width, bag_height, exhibitor_height, tray_quantity, tray_length, tray_width, tray_divisions, classification, line, image, pieces_per_package, business_unit_id, warehouse_id, cost, rack, level, sat_key_id, sat_unit_key_id, current, store_id, supplier_id, unit_id) FROM stdin;
\.


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('products_id_seq', 1, false);


--
-- Data for Name: prospect_sales; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY prospect_sales (id, prospect_id, sales_amount, sales_quantity, cost, created_at, updated_at, month, year, store_id, business_unit_id, discount) FROM stdin;
\.


--
-- Name: prospect_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('prospect_sales_id_seq', 1, false);


--
-- Data for Name: prospects; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY prospects (id, store_id, created_at, updated_at, prospect_type, contact_first_name, contact_middle_name, contact_last_name, contact_position, direct_phone, extension, cell_phone, business_type, prospect_status, legal_or_business_name, billing_address_id, delivery_address_id, second_last_name, business_unit_id, email, business_group_id, store_code, store_type_id, store_prospect_id, credit_days) FROM stdin;
\.


--
-- Name: prospects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('prospects_id_seq', 1, false);


--
-- Data for Name: relation_types; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY relation_types (id, description, created_at, updated_at, key) FROM stdin;
\.


--
-- Name: relation_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('relation_types_id_seq', 1, false);


--
-- Data for Name: request_users; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY request_users (id, request_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: request_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('request_users_id_seq', 1, false);


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY requests (id, product_type, product_what, product_length, product_width, product_height, product_weight, for_what, quantity, inner_length, inner_width, inner_height, outer_length, outer_width, outer_height, bag_length, bag_width, bag_height, main_material, resistance_main_material, secondary_material, resistance_secondary_material, third_material, resistance_third_material, impression, inks, impression_finishing, delivery_date, maximum_sales_price, observations, notes, prospect_id, created_at, updated_at, final_quantity, payment_uploaded, authorisation_signed, date_finished, internal_cost, internal_price, sales_price, impression_where, design_like, resistance_like, rigid_color, paper_type_rigid, store_id, require_design, exterior_material_color, interior_material_color, status, exhibitor_height, tray_quantity, tray_length, tray_width, tray_divisions, name_type, contraencolado, authorised_without_doc, how_many, authorised_without_pay, boxes_stow, specification, what_measures, specification_document, sensitive_fields_changed, payment, authorisation, authorised, last_status, product_id, estimate_doc_id, second_quantity, third_quantity, second_internal_cost, third_internal_cost, second_internal_price, third_internal_price, second_sales_price, third_sales_price, price_selected) FROM stdin;
\.


--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('requests_id_seq', 1, false);


--
-- Data for Name: resistances; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY resistances (id, name, created_at, updated_at) FROM stdin;
\.


--
-- Name: resistances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('resistances_id_seq', 1, false);


--
-- Data for Name: return_tickets; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY return_tickets (id, ticket_id, ticket_number, created_at, updated_at, store_id, bill_id) FROM stdin;
\.


--
-- Name: return_tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('return_tickets_id_seq', 1, false);


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY roles (id, name, description, created_at, updated_at, translation) FROM stdin;
\.


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('roles_id_seq', 1, false);


--
-- Data for Name: sales_targets; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY sales_targets (id, store_id, month, year, target, actual_sales, achieved, created_at, updated_at) FROM stdin;
\.


--
-- Name: sales_targets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('sales_targets_id_seq', 1, false);


--
-- Data for Name: sat_keys; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY sat_keys (id, sat_key, description, created_at, updated_at) FROM stdin;
\.


--
-- Name: sat_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('sat_keys_id_seq', 1, false);


--
-- Data for Name: sat_unit_keys; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY sat_unit_keys (id, unit, description, created_at, updated_at) FROM stdin;
\.


--
-- Name: sat_unit_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('sat_unit_keys_id_seq', 1, false);


--
-- Data for Name: sat_zipcodes; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY sat_zipcodes (id, zipcode, created_at, updated_at) FROM stdin;
\.


--
-- Name: sat_zipcodes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('sat_zipcodes_id_seq', 1, false);


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY schema_migrations (version) FROM stdin;
20170531025802
20170531031624
20170601212349
20170601212535
20170605195623
20170606013447
20170606175343
20170606191231
20170606202219
20170606202253
20170606202314
20170606202348
20170606202409
20170606202424
20170606222359
20170606222414
20170606222448
20170606235623
20170612165915
20170613174532
20170613174742
20170613175958
20170613180037
20170613180108
20170613180543
20170613181245
20170613182114
20170613183052
20170613183111
20170613184818
20170613185231
20170613185920
20170613190419
20170613190437
20170613213257
20170613213541
20170613213633
20170613213810
20170613214000
20170613214310
20170613214849
20170613215357
20170613215510
20170613224310
20170613230227
20170613230416
20170613231152
20170613234425
20170613234500
20170613234551
20170613235137
20170613235318
20170614154011
20170616000424
20170616164937
20170616170556
20170616181621
20170616181752
20170616182014
20170616182048
20170616182149
20170616182241
20170617030657
20170617031848
20170617035951
20170617041920
20170619152515
20170619152616
20170619153221
20170619153336
20170619153401
20170619153610
20170619153626
20170619175053
20170621152725
20170621160411
20170621161545
20170621163707
20170621164624
20170621201610
20170621201630
20170622165422
20170622165617
20170622183548
20170622183627
20170622183846
20170622184513
20170622184999
20170626180035
20170626180600
20170626181238
20170626181515
20170627221430
20170628172934
20170630195828
20170630203024
20170630203106
20170630205120
20170630205145
20170630212731
20170630212905
20170630213026
20170630213104
20170630220602
20170630220626
20170630220731
20170630220745
20170630234518
20170630235651
20170630235853
20170701171754
20170701222345
20170702192823
20170702193229
20170702193719
20170702194035
20170702195519
20170702214640
20170702214757
20170702214804
20170703182847
20170703183452
20170703183507
20170703183530
20170703183551
20170703184407
20170703184421
20170703184743
20170703184817
20170704165213
20170705161826
20170707173912
20170707193305
20170707193321
20170707200256
20170707220546
20170707222445
20170709162255
20170712191901
20170712214155
20170712222556
20170713200057
20170713212029
20170713213326
20170713223156
20170713223950
20170717200925
20170717210310
20170718160325
20170718160616
20170718160727
20170718162024
20170718165540
20170718171013
20170718171102
20170718203206
20170718203244
20170718205024
20170719014339
20170720225255
20170720225258
20170721203138
20170722222459
20170722222542
20170722222905
20170722223709
20170722223918
20170725164436
20170725164451
20170725170349
20170725170537
20170725170832
20170725171222
20170725173123
20170725173149
20170725173342
20170725173350
20170725174617
20170725174640
20170725174907
20170725175114
20170725175342
20170725175431
20170725175547
20170725180156
20170725180255
20170725182359
20170725182649
20170725182949
20170725184321
20170725184410
20170725185014
20170725185121
20170725185350
20170725185526
20170725185538
20170725185711
20170725185747
20170725190232
20170725190438
20170725190911
20170725191623
20170725221333
20170725222403
20170725230731
20170726002220
20170726002235
20170726002700
20170726220155
20170726220206
20170726220722
20170726220755
20170727191419
20170727191502
20170727191946
20170730150241
20170730234235
20170731002849
20170731003204
20170731004159
20170731005620
20170731005638
20170731010432
20170731010600
20170731223949
20170731224314
20170802190703
20170806143935
20170807193155
20170809023547
20170809023829
20170809023928
20170809023941
20170809023957
20170809030746
20170809034225
20170809034533
20170809035109
20170809035520
20170810184126
20170810191451
20170810231811
20170810231927
20170810232221
20170810235555
20170811000745
20170812193124
20170812202900
20170814170620
20170814172259
20170814172332
20170814173110
20170814174447
20170814174536
20170816001235
20170816001502
20170816002927
20170816005722
20170816011629
20170816020400
20170816034454
20170816193736
20170817025245
20170817043858
20170817044058
20170817151458
20170817161922
20170817173051
20170818190019
20170818215552
20170818223053
20170818225732
20170818230502
20170819173433
20170826192943
20170830152656
20170830185706
20170830190026
20170901170112
20170905185945
20170905191329
20170906144248
20170906185652
20170907204154
20170911011402
20170914171610
20170914173139
20170916180728
20170916181433
20170916183247
20170916183312
20170916183336
20170916183358
20170916183431
20170916183511
20170916183810
20170916184029
20170916184649
20170916185123
20170916185247
20170916185511
20170916190329
20170916190646
20170916190733
20170916190908
20170916190999
20170916193319
20170916193625
20170916193658
20170916193726
20170916193733
20170916193901
20170916194610
20170916211712
20170916212114
20170918214612
20170920181537
20170920181921
20170920184014
20170920213640
20170920213700
20170921182521
20170921182535
20170922001748
20170922010718
20170922011432
20170922013427
20170922014320
20170922030627
20170922031436
20170922032452
20170922033343
20170922033641
20170922034148
20170925232640
20170925233014
20170925233024
20170925234908
20170925235830
20170926001001
20170926005142
20170926005708
20170926010544
20170926010940
20170926011538
20170926014412
20170926015722
20170926020158
20170926020205
20170926032300
20170926032502
20170926032821
20170926033629
20170926033635
20170926184717
20170926190834
20170926220759
20170926224637
20170927223231
20170928171627
20170928234610
20170929015800
20170929020108
20170929030905
20170929201135
20170929204914
20170929205021
20170929205801
20170930000725
20170930001505
20170930203231
20170930204636
20170930204656
20170930205403
20170930210853
20171002144457
20171002161816
20171002162009
20171003001230
20171003001257
20171003001304
20171003001315
20171003001324
20171003001338
20171003001355
20171003001632
20171003001655
20171003002521
20171003003007
20171003003346
20171003013151
20171003013430
20171003015103
20171003161517
20171003161708
20171003161732
20171003161743
20171003161802
20171003161809
20171003162139
20171003164125
20171003164135
20171003164156
20171003164341
20171003182149
20171003182310
20171003182500
20171003183147
20171003213625
20171003213653
20171003213849
20171003213927
20171003220551
20171003220827
20171003220912
20171003221020
20171004011948
20171008212152
20171009020046
20171009172044
20171009172712
20171009172753
20171010032301
20171010032353
20171011160211
20171012172303
20171012172838
20171012172958
20171012173219
20171012175438
20171012175514
20171012181023
20171012181037
20171012181921
20171012182353
20171012182651
20171012183216
20171012183223
20171012183652
20171012183752
20171012183959
20171012190622
20171012191100
20171012191107
20171012191538
20171012191600
20171012191607
20171012192132
20171012215745
20171012222216
20171012224230
20171012224249
20171013000811
20171013010605
20171013145444
20171013211505
20171013215707
20171013215723
20171013215736
20171013220039
20171013220537
20171013220543
20171013220552
20171013220610
20171014001618
20171014002330
20171015232822
20171016153654
20171017023649
20171017023720
20171017023820
20171017023946
20171017023956
20171017024005
20171018014406
20171018014440
20171018014447
20171018163430
20171018163502
20171019201219
20171019235913
20171020012824
\.


--
-- Data for Name: service_offereds; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY service_offereds (id, service_id, store_id, created_at, updated_at, initial_price, automatic_discount, manual_discount, discount_applied, rule_could_be, final_price, amount, service_type, return_ticket_id, change_ticket_id, tax_id, taxes, cost, ticket_id, total_cost, quantity, discount_reason) FROM stdin;
\.


--
-- Name: service_offereds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('service_offereds_id_seq', 1, false);


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY services (id, unique_code, description, price, sat_key_id, unit, sat_unit_key_id, shared, store_id, business_unit_id, created_at, updated_at, delivery_company) FROM stdin;
\.


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('services_id_seq', 1, false);


--
-- Data for Name: store_movements; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY store_movements (id, product_id, quantity, movement_type, order_id, ticket_id, store_id, initial_price, automatic_discount, manual_discount, discount_applied, rule_could_be, final_price, amount, return_ticket_id, change_ticket_id, tax_id, taxes, cost, supplier_id, product_request_id, created_at, updated_at, total_cost, discount_reason) FROM stdin;
\.


--
-- Name: store_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('store_movements_id_seq', 1, false);


--
-- Data for Name: store_sales; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY store_sales (id, store_id, month, year, sales_amount, sales_quantity, cost, created_at, updated_at, discount) FROM stdin;
\.


--
-- Name: store_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('store_sales_id_seq', 1, false);


--
-- Data for Name: store_types; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY store_types (id, store_type, created_at, updated_at) FROM stdin;
\.


--
-- Name: store_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('store_types_id_seq', 1, false);


--
-- Data for Name: store_use_inventories; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY store_use_inventories (id, store_id, product_id, quantity, created_at, updated_at) FROM stdin;
\.


--
-- Name: store_use_inventories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('store_use_inventories_id_seq', 1, false);


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY stores (id, created_at, updated_at, store_code, store_name, delivery_address_id, business_unit_id, store_type_id, email, cost_type_id, cost_type_selected_since, months_in_inventory, reorder_point, critical_point, contact_first_name, contact_middle_name, contact_last_name, direct_phone, extension, type_of_person, second_last_name, business_group_id, cell_phone, zip_code, period_sales_achievement, inspection_approved, overprice, series, last_bill) FROM stdin;
\.


--
-- Name: stores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('stores_id_seq', 1, false);


--
-- Data for Name: stores_inventories; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY stores_inventories (id, product_id, store_id, quantity, alert, alert_type, created_at, updated_at, rack, level, manual_price_update) FROM stdin;
\.


--
-- Name: stores_inventories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('stores_inventories_id_seq', 1, false);


--
-- Data for Name: stores_suppliers; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY stores_suppliers (id, store_id, supplier_id, created_at, updated_at) FROM stdin;
\.


--
-- Name: stores_suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('stores_suppliers_id_seq', 1, false);


--
-- Data for Name: stores_warehouse_entries; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY stores_warehouse_entries (id, product_id, store_id, quantity, movement_id, created_at, updated_at, retail_units_per_unit, units_used, store_movement_id) FROM stdin;
\.


--
-- Name: stores_warehouse_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('stores_warehouse_entries_id_seq', 1, false);


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY suppliers (id, name, business_type, created_at, updated_at, type_of_person, contact_first_name, contact_middle_name, contact_last_name, contact_position, direct_phone, extension, cell_phone, email, supplier_status, delivery_address_id, last_purchase_bill_date, store_id, last_purchase_folio) FROM stdin;
\.


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('suppliers_id_seq', 1, false);


--
-- Data for Name: tax_regimes; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY tax_regimes (id, description, created_at, updated_at, tax_id, corporate, particular, date_since) FROM stdin;
\.


--
-- Name: tax_regimes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('tax_regimes_id_seq', 1, false);


--
-- Data for Name: taxes; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY taxes (id, description, value, created_at, updated_at, key, transfer, retention) FROM stdin;
\.


--
-- Name: taxes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('taxes_id_seq', 1, false);


--
-- Data for Name: temporal_numbers; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY temporal_numbers (id, store_id, business_group_id, past_sales, future_sales, created_at, updated_at) FROM stdin;
\.


--
-- Name: temporal_numbers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('temporal_numbers_id_seq', 1, false);


--
-- Data for Name: terminals; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY terminals (id, name, bank_id, number, store_id, created_at, updated_at, debit_comission, credit_comission) FROM stdin;
\.


--
-- Name: terminals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('terminals_id_seq', 1, false);


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY tickets (id, user_id, store_id, subtotal, tax_id, taxes, total, prospect_id, bill_id, ticket_type, created_at, updated_at, cash_register_id, ticket_number, cfdi_use_id, comments) FROM stdin;
\.


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('tickets_id_seq', 1, false);


--
-- Data for Name: type_of_bills; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY type_of_bills (id, description, created_at, updated_at, key) FROM stdin;
\.


--
-- Name: type_of_bills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('type_of_bills_id_seq', 1, false);


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY units (id, name, plural_name, abbreviation, created_at, updated_at) FROM stdin;
\.


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('units_id_seq', 1, false);


--
-- Data for Name: user_requests; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY user_requests (id, user_id, request_id) FROM stdin;
\.


--
-- Name: user_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('user_requests_id_seq', 1, false);


--
-- Data for Name: user_sales; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY user_sales (id, user_id, month, year, sales_amount, sales_quantity, cost, created_at, updated_at) FROM stdin;
\.


--
-- Name: user_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('user_sales_id_seq', 1, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY users (id, email, encrypted_password, reset_password_token, reset_password_sent_at, remember_created_at, sign_in_count, current_sign_in_at, last_sign_in_at, current_sign_in_ip, last_sign_in_ip, created_at, updated_at, first_name, middle_name, last_name, store_id, role_id) FROM stdin;
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('users_id_seq', 1, false);


--
-- Data for Name: warehouse_entries; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY warehouse_entries (id, product_id, quantity, entry_number, created_at, updated_at, movement_id, store_id, retail_units_per_unit, units_used) FROM stdin;
\.


--
-- Name: warehouse_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('warehouse_entries_id_seq', 1, false);


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY warehouses (id, name, delivery_address_id, created_at, updated_at, business_unit_id, store_id, warehouse_code, business_group_id) FROM stdin;
\.


--
-- Name: warehouses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('warehouses_id_seq', 1, false);


--
-- Data for Name: withdrawals; Type: TABLE DATA; Schema: public; Owner: faviovelez
--

COPY withdrawals (id, user_id, store_id, amount, created_at, updated_at, cash_register_id, name) FROM stdin;
\.


--
-- Name: withdrawals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: faviovelez
--

SELECT pg_catalog.setval('withdrawals_id_seq', 1, false);


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
-- Name: index_bills_on_cfdi_use_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_cfdi_use_id ON bills USING btree (cfdi_use_id);


--
-- Name: index_bills_on_child_bills_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_child_bills_id ON bills USING btree (child_bills_id);


--
-- Name: index_bills_on_country_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_country_id ON bills USING btree (country_id);


--
-- Name: index_bills_on_currency_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_currency_id ON bills USING btree (currency_id);


--
-- Name: index_bills_on_expedition_zip_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_expedition_zip_id ON bills USING btree (expedition_zip_id);


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
-- Name: index_bills_on_payment_condition_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_bills_on_payment_condition_id ON bills USING btree (payment_condition_id);


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
-- Name: index_exterior_colors_on_material_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_exterior_colors_on_material_id ON exterior_colors USING btree (material_id);


--
-- Name: index_images_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_images_on_product_id ON images USING btree (product_id);


--
-- Name: index_interior_colors_on_material_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_interior_colors_on_material_id ON interior_colors USING btree (material_id);


--
-- Name: index_inventories_on_product_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_inventories_on_product_id ON inventories USING btree (product_id);


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
-- Name: index_sales_targets_on_store_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_sales_targets_on_store_id ON sales_targets USING btree (store_id);


--
-- Name: index_service_offereds_on_change_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_service_offereds_on_change_ticket_id ON service_offereds USING btree (change_ticket_id);


--
-- Name: index_service_offereds_on_return_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_service_offereds_on_return_ticket_id ON service_offereds USING btree (return_ticket_id);


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
-- Name: index_store_movements_on_change_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_movements_on_change_ticket_id ON store_movements USING btree (change_ticket_id);


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
-- Name: index_store_movements_on_return_ticket_id; Type: INDEX; Schema: public; Owner: faviovelez
--

CREATE INDEX index_store_movements_on_return_ticket_id ON store_movements USING btree (return_ticket_id);


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
-- Name: fk_rails_27628bcf10; Type: FK CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY services
    ADD CONSTRAINT fk_rails_27628bcf10 FOREIGN KEY (business_unit_id) REFERENCES business_units(id);


--
-- Name: fk_rails_7acf3c35f6; Type: FK CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY services
    ADD CONSTRAINT fk_rails_7acf3c35f6 FOREIGN KEY (sat_unit_key_id) REFERENCES sat_unit_keys(id);


--
-- Name: fk_rails_9db343ab98; Type: FK CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY services
    ADD CONSTRAINT fk_rails_9db343ab98 FOREIGN KEY (store_id) REFERENCES stores(id);


--
-- Name: fk_rails_f02974afac; Type: FK CONSTRAINT; Schema: public; Owner: faviovelez
--

ALTER TABLE ONLY services
    ADD CONSTRAINT fk_rails_f02974afac FOREIGN KEY (sat_key_id) REFERENCES sat_keys(id);


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
