--
-- PostgreSQL database dump
--

-- Dumped from database version 11.0
-- Dumped by pg_dump version 11.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: lyrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lyrics (
    title character varying NOT NULL,
    artist character varying,
    slyrics character varying[],
    sid bigint NOT NULL
);


ALTER TABLE public.lyrics OWNER TO postgres;

--
-- Name: Lyrics_songId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Lyrics_songId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Lyrics_songId_seq" OWNER TO postgres;

--
-- Name: Lyrics_songId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Lyrics_songId_seq" OWNED BY public.lyrics.sid;


--
-- Name: songId; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."songId"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."songId" OWNER TO postgres;

--
-- Name: lyrics sid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lyrics ALTER COLUMN sid SET DEFAULT nextval('public."Lyrics_songId_seq"'::regclass);


--
-- Name: lyrics Lyrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lyrics
    ADD CONSTRAINT "Lyrics_pkey" PRIMARY KEY (sid);


--
-- PostgreSQL database dump complete
--

