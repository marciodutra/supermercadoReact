--
-- PostgreSQL database dump
--

\restrict v3oLaZ7Sa0aKEfezBGH7UmNeaNNMQK1OxqwnvunFuVgMhZeZRvvaM4j2nyrbQ5Y

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-19 19:40:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16410)
-- Name: itens_venda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itens_venda (
    id integer NOT NULL,
    venda_id integer,
    produto_id integer,
    nome text,
    quantidade integer,
    preco numeric(10,2),
    subtotal numeric(10,2)
);


ALTER TABLE public.itens_venda OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16409)
-- Name: itens_venda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.itens_venda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.itens_venda_id_seq OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 223
-- Name: itens_venda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.itens_venda_id_seq OWNED BY public.itens_venda.id;


--
-- TOC entry 220 (class 1259 OID 16388)
-- Name: produtos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produtos (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    codigo_barras character varying(50),
    categoria character varying(100),
    preco numeric(10,2) NOT NULL,
    estoque integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.produtos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16387)
-- Name: produtos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produtos_id_seq OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 219
-- Name: produtos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;


--
-- TOC entry 222 (class 1259 OID 16400)
-- Name: vendas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendas (
    id integer NOT NULL,
    total numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.vendas OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16399)
-- Name: vendas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendas_id_seq OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 221
-- Name: vendas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendas_id_seq OWNED BY public.vendas.id;


--
-- TOC entry 4871 (class 2604 OID 16413)
-- Name: itens_venda id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda ALTER COLUMN id SET DEFAULT nextval('public.itens_venda_id_seq'::regclass);


--
-- TOC entry 4866 (class 2604 OID 16391)
-- Name: produtos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);


--
-- TOC entry 4869 (class 2604 OID 16403)
-- Name: vendas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas ALTER COLUMN id SET DEFAULT nextval('public.vendas_id_seq'::regclass);


--
-- TOC entry 5032 (class 0 OID 16410)
-- Dependencies: 224
-- Data for Name: itens_venda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itens_venda (id, venda_id, produto_id, nome, quantidade, preco, subtotal) FROM stdin;
1	1	2	Arroz	1	10.00	10.00
2	1	3	Feijão	1	8.00	8.00
3	2	2	Arroz	1	10.00	10.00
4	2	3	Feijão	1	8.00	8.00
5	3	2	Arroz	1	10.00	10.00
6	3	3	Feijão	1	8.00	8.00
7	4	2	Arroz	1	10.00	10.00
8	4	3	Feijão	1	8.00	8.00
9	5	2	Arroz	1	10.00	10.00
10	5	3	Feijão	1	8.00	8.00
\.


--
-- TOC entry 5028 (class 0 OID 16388)
-- Dependencies: 220
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produtos (id, nome, codigo_barras, categoria, preco, estoque, created_at) FROM stdin;
2	Arroz	123456	Alimentos	10.00	45	2026-06-19 17:09:28.48254
3	Feijão	789654	Alimentos	8.00	95	2026-06-19 17:34:21.807585
4	Açúcar Refinado	789100000001	Mercearia	5.99	100	2026-06-19 19:15:11.369644
5	Sal Refinado	789100000002	Mercearia	2.99	100	2026-06-19 19:15:11.369644
6	Macarrão Espaguete	789100000003	Mercearia	4.50	80	2026-06-19 19:15:11.369644
7	Óleo de Soja	789100000004	Mercearia	7.99	60	2026-06-19 19:15:11.369644
8	Farinha de Trigo	789100000005	Mercearia	6.50	70	2026-06-19 19:15:11.369644
9	Café Torrado	789100000006	Bebidas	12.90	50	2026-06-19 19:15:11.369644
10	Leite Integral	789100000007	Laticínios	5.49	120	2026-06-19 19:15:11.369644
11	Leite Desnatado	789100000008	Laticínios	5.79	100	2026-06-19 19:15:11.369644
12	Manteiga	789100000009	Laticínios	8.99	50	2026-06-19 19:15:11.369644
13	Margarina	789100000010	Laticínios	6.99	60	2026-06-19 19:15:11.369644
14	Queijo Mussarela	789100000011	Frios	14.90	40	2026-06-19 19:15:11.369644
15	Presunto Cozido	789100000012	Frios	12.50	40	2026-06-19 19:15:11.369644
16	Iogurte Natural	789100000013	Laticínios	4.99	80	2026-06-19 19:15:11.369644
17	Refrigerante Cola 2L	789100000014	Bebidas	8.99	90	2026-06-19 19:15:11.369644
18	Refrigerante Guaraná 2L	789100000015	Bebidas	8.49	90	2026-06-19 19:15:11.369644
19	Suco de Laranja 1L	789100000016	Bebidas	7.99	60	2026-06-19 19:15:11.369644
20	Água Mineral 500ml	789100000017	Bebidas	2.50	200	2026-06-19 19:15:11.369644
21	Biscoito Recheado	789100000018	Mercearia	3.99	120	2026-06-19 19:15:11.369644
22	Biscoito Cream Cracker	789100000019	Mercearia	4.29	100	2026-06-19 19:15:11.369644
23	Chocolate ao Leite	789100000020	Doces	6.99	80	2026-06-19 19:15:11.369644
24	Sabão em Pó	789100000021	Limpeza	14.99	50	2026-06-19 19:15:11.369644
25	Detergente Líquido	789100000022	Limpeza	2.99	120	2026-06-19 19:15:11.369644
26	Água Sanitária	789100000023	Limpeza	4.99	90	2026-06-19 19:15:11.369644
27	Desinfetante	789100000024	Limpeza	6.99	70	2026-06-19 19:15:11.369644
28	Esponja de Louça	789100000025	Limpeza	1.99	200	2026-06-19 19:15:11.369644
29	Papel Higiênico 12 Rolos	789100000026	Higiene	18.90	60	2026-06-19 19:15:11.369644
30	Creme Dental	789100000027	Higiene	4.99	100	2026-06-19 19:15:11.369644
31	Escova Dental	789100000028	Higiene	5.99	100	2026-06-19 19:15:11.369644
32	Shampoo	789100000029	Higiene	12.99	60	2026-06-19 19:15:11.369644
33	Condicionador	789100000030	Higiene	13.99	60	2026-06-19 19:15:11.369644
34	Sabonete	789100000031	Higiene	2.49	200	2026-06-19 19:15:11.369644
35	Desodorante Aerosol	789100000032	Higiene	11.99	80	2026-06-19 19:15:11.369644
36	Fralda Infantil	789100000033	Infantil	39.90	40	2026-06-19 19:15:11.369644
37	Lenço Umedecido	789100000034	Infantil	8.99	70	2026-06-19 19:15:11.369644
38	Cereal Matinal	789100000035	Mercearia	10.99	50	2026-06-19 19:15:11.369644
39	Achocolatado	789100000036	Mercearia	9.99	70	2026-06-19 19:15:11.369644
40	Gelatina	789100000037	Mercearia	1.99	150	2026-06-19 19:15:11.369644
41	Milho Verde	789100000038	Enlatados	4.29	80	2026-06-19 19:15:11.369644
42	Ervilha	789100000039	Enlatados	4.29	80	2026-06-19 19:15:11.369644
43	Atum Enlatado	789100000040	Enlatados	8.99	60	2026-06-19 19:15:11.369644
44	Sardinha Enlatada	789100000041	Enlatados	6.99	60	2026-06-19 19:15:11.369644
45	Molho de Tomate	789100000042	Mercearia	3.49	100	2026-06-19 19:15:11.369644
46	Ketchup	789100000043	Mercearia	7.49	60	2026-06-19 19:15:11.369644
47	Maionese	789100000044	Mercearia	8.49	60	2026-06-19 19:15:11.369644
48	Mostarda	789100000045	Mercearia	5.99	60	2026-06-19 19:15:11.369644
49	Pão de Forma	789100000046	Padaria	8.99	40	2026-06-19 19:15:11.369644
50	Pão de Hambúrguer	789100000047	Padaria	7.99	40	2026-06-19 19:15:11.369644
51	Batata Palha	789100000048	Mercearia	9.99	50	2026-06-19 19:15:11.369644
52	Amendoim Torrado	789100000049	Petiscos	5.99	70	2026-06-19 19:15:11.369644
53	Pipoca de Micro-ondas	789100000050	Petiscos	4.99	80	2026-06-19 19:15:11.369644
\.


--
-- TOC entry 5030 (class 0 OID 16400)
-- Dependencies: 222
-- Data for Name: vendas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendas (id, total, created_at) FROM stdin;
1	18.00	2026-06-19 17:47:09.749234
2	18.00	2026-06-19 17:55:28.562199
3	18.00	2026-06-19 18:24:49.18734
4	18.00	2026-06-19 18:49:06.855845
5	18.00	2026-06-19 19:06:20.015319
\.


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 223
-- Name: itens_venda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.itens_venda_id_seq', 10, true);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 219
-- Name: produtos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produtos_id_seq', 53, true);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 221
-- Name: vendas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendas_id_seq', 5, true);


--
-- TOC entry 4877 (class 2606 OID 16418)
-- Name: itens_venda itens_venda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda
    ADD CONSTRAINT itens_venda_pkey PRIMARY KEY (id);


--
-- TOC entry 4873 (class 2606 OID 16398)
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- TOC entry 4875 (class 2606 OID 16408)
-- Name: vendas vendas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_pkey PRIMARY KEY (id);


--
-- TOC entry 4878 (class 2606 OID 16424)
-- Name: itens_venda itens_venda_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda
    ADD CONSTRAINT itens_venda_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id);


--
-- TOC entry 4879 (class 2606 OID 16419)
-- Name: itens_venda itens_venda_venda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda
    ADD CONSTRAINT itens_venda_venda_id_fkey FOREIGN KEY (venda_id) REFERENCES public.vendas(id);


-- Completed on 2026-06-19 19:40:38

--
-- PostgreSQL database dump complete
--

\unrestrict v3oLaZ7Sa0aKEfezBGH7UmNeaNNMQK1OxqwnvunFuVgMhZeZRvvaM4j2nyrbQ5Y

