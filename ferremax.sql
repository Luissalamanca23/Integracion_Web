SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `Boletas` (
  `ID` int NOT NULL,
  `Numero_Orden` varchar(50) NOT NULL,
  `Items` json NOT NULL,
  `Precios` json NOT NULL,
  `Cantidades` json NOT NULL,
  `Fecha_Actual` date NOT NULL,
  `Fecha_Despacho` date NOT NULL,
  `Total` decimal(10,2) NOT NULL,
  `Total_Despacho` decimal(10,2) NOT NULL,
  `Aceptado` tinyint DEFAULT '0',
  `Estado` varchar(50) DEFAULT 'Pendiente',
  `usuario_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Boletas`
--

INSERT INTO `Boletas` (`ID`, `Numero_Orden`, `Items`, `Precios`, `Cantidades`, `Fecha_Actual`, `Fecha_Despacho`, `Total`, `Total_Despacho`, `Aceptado`, `Estado`, `usuario_id`) VALUES
(1, '244-3855-90002', '[\"Martillo Stanley\"]', '[\"15.99\"]', '[1]', '2025-07-10', '2025-07-13', 15163.80, 18663.80, 1, 'Entregado', 1),
(2, '524-8242-84529', '[\"Martillo Stanley\"]', '[\"15.99\"]', '[1]', '2025-07-10', '2025-07-13', 15163.80, 18663.80, 0, 'En Preparación', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `ID` int NOT NULL,
  `user_id` int NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` text,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `ID` int NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `ID_Tipo` int NOT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Moneda` varchar(3) NOT NULL DEFAULT 'CLP',
  `Cantidad` int NOT NULL DEFAULT '0',
  `Stock_Central` int NOT NULL DEFAULT '0',
  `Stock_Norte` int NOT NULL DEFAULT '0',
  `Stock_Centro` int NOT NULL DEFAULT '0',
  `Peso` decimal(10,2) DEFAULT NULL,
  `Color` varchar(50) DEFAULT NULL,
  `Garantia` varchar(100) DEFAULT NULL,
  `Modelo` varchar(100) DEFAULT NULL,
  `Img` longblob
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`ID`, `Nombre`, `ID_Tipo`, `Precio`, `Moneda`, `Cantidad`, `Stock_Central`, `Stock_Norte`, `Stock_Centro`, `Peso`, `Color`, `Garantia`, `Modelo`, `Img`) VALUES
(1, 'Taladro Bosch GSB 13 RE', 1, 54990.00, 'CLP', 25, 10, 8, 7, 1.40, 'Azul', '24', 'GSB 13 RE', NULL),
(2, 'Martillo Stanley', 2, 15.99, 'USD', 48, 20, 15, 15, 0.50, 'Negro', '12', 'STHT51512', NULL),
(3, 'Destornillador Phillips', 2, 8500.00, 'CLP', 100, 40, 30, 30, 0.20, 'Rojo', '6', 'PH-001', NULL),
(4, 'Sierra Circular Makita', 1, 299.99, 'USD', 15, 5, 5, 5, 3.20, 'Verde', '36', 'HS7601', NULL),
(5, 'Alicate Universal', 2, 12000.00, 'CLP', 75, 25, 25, 25, 0.30, 'Negro', '12', 'AL-100', NULL),
(6, 'lapiz', 3, 3000.00, 'CLP', 21, 1, 3, 5, 1.00, 'rojo', '1', 'lapiz', 0x52494646421000005745425056503820361000009067009d012a2a022b013e3d1e8d44a221a1117a1c5c2003c4b3b77e3fc7f4cc7f07fe8064861ec7ea2fa6136e03b5b655f24fe87fa67f4af5c7b1bf3cfc0ff94bd101667981f92fe97fe63fbcfe2bfd16f445e609fc2bf927f95feb7f8afdd83ccdfeeaefa07f43ff9dffffffff6bbfa0df99affbffdd9f869fd8fff67fd27f7ffffffca5e72d7758d645c35fd5f579d24f65fb556f9c10de2dec599abf960fdebfddf01b10d5bb18f790e9735f0dbab1ef21d2e6be1b7563de43a5cd7c36eac7bc874b9af86dd58f790e9735f0dbab1ef21d2e6be1b7563de43a5cd7c36eac7ba9a54eda6c999a1f335cbef10e9735f0dbab1ef21d2e6be1b28c67343336c4770a7327ea9c0466f8c131a6ba1648cea8f4b9af86dd58f790e9735f0db7ea66ec96b25f90caee52deb6d3f5561497bea295a7ef7e65b003c4484d27790e9735f0dbaad87e0f81a392d83742ae9c0f42c2777e1062526df3257b27add23550f21349de43a5cd7c36eac7a6225a0c9e49face82e664d8e5ab99d98d66ab95b767cf444acac5b40ef9954d27790e9735f0dbaae326fc00a9136ca8b3ff8e430cfaf461b527e5a3d50e581b095939f61b8fa1fe07d2e6be1b7563de43a3d9f87bea794332f4b78f5768167377bf72dc73a018a9fb61f32cf0afeda994c73f4b66c2fd7bc874b9af86dd58f78c441f2a3f62248ed1eda7ed7e0e1d93d265db05f8c86819424eff8620d7e66a5955d22388909a4ef21d2e6be1b2c0e5327a419ce411b390c14a8493d8adf646a8bdc44aee3cf016f41acdb0f939a4ae7ad02242693bc874b9af86dbf5333d720f6b678d589e73ab9e1a281ff9f486b1df3894481b076f5d3e5653707b18f790e9735f0dbab19ca9b1b3314d8d7062a8e9090aa20ff1a59a49a3857e0e58c6c6065da8ec2242693bc874b9af86dbf5333d720e1200fad51ae23a5466276a2db75b0bb81da70f998ae6d5d6c2ab7631ef21d2e6be1b74f6142ef0e1265f4c85e1cfda3a93060cd246a46af9fb8418ee481c8909a4ef21d2e6be17b752023587d9424d09f542f53919a0767efbfd43ae187f2693bc874b9af86dd58f46d41f4130d0b0b94e6e7e42a4799492423c8a749983316c60fa5cd7c36eac7bc87473557aed15c60d0b5c433bbb8f4c6af506f3a4cbfd2c388909a4ef21c40000fefc3bc00000000000000068b60ee7b87fc7ad2f62c57273e28fc652f1bc7e3ba15adfe4855154673c5c301cece920f8ac038afc2bdbd079fdf09e42900aa7980cc63bf2fe15eff0ce9da04343dcfdc11618a2dc7fa3e1ad38e85fc9c0e529dfc9c0c4bba1dca6c1610af955a77ffc9b760387e551041e2c38f6e08e170d93f921ab00097d977047b110e67a1185ee1eab8cbb53bbd960fc1211b8299218c584c8fcef58c24d1042cd05062d13a8466881dff85b56990e58a72eae6de092a13e827eebbf6f1a8fb9c06d587db4adaaf9f61cf780300118fb9dcd52ade8ed1f2e9c76ab2f850728c7539de8905e33023b8c87f4de7be0f8330874375ad030a793920bbaca5c6394b7dd0926ff2047305d1c52c8a96be986874363bc1b14433ee1a63e68e6828f61466eae3763e568c9063a661f21d0519dc51cc559b0abb0653fddb784c889ac64a622c6efd731566fdab97bdf03317fefa8d0542e12a47c5e4e1940fa1138000d88fb57693302f98faca6cc69d508f865453d461b842dc6b427a9dbefcf8fdbd4c28a2f615d389aad5a9a9423b4595a56191b458e827eebf39f70b80a0e4c00636d2b80acc40dd46fb23cf758fd78c77d421431c0d7fe9fd9329462f171351ffb3d9b38f48b0a6e0c487847e83ef560a4621723d677e244360b0bc84fd231a045ecb1066374482592b2031f260f5d8cfadceac4aec2457dd2202d4b0378cbf466bbbd01982bf4e6249f3598daec8bf260524dd5a3e7dd3ee75222ed6b6f27f5a3cb8aa2825c13feb6175cb5ec655910f422752eb229a338655dcf1d4b0df835e1906b2f7f506f5455ebe4796001ab47d76f616d96ca19f8ff71d4c6be08e8183c97711c7fb59c776e3029c2931fdab338fa57c80c99d9f854b2824fa0ede08c3f57f632da128a65b2c41cafd65a7cf91daab167fa4bb5fb5e1d6bd9c6abbf821d8a04c26a66f2f5a1f2163fe860b2844d7043bd931ab5667d6b4d9cf5e04fc4a6a181e70282f8b4ed89ca89be56342c771b7a258090054fc7cb2ae8c0831ddedb340881e796de6ab9552a534204a8c58b125f7b2acbb9703555b6601a81c8ef14121926d362a283c1675d1764001fbc55d6875429c20fb72284d73f11165b5146b4247f71de7089fa2da0348891759f7845e33f419c167b22bb30e4ea1aa26cd8606e96d116b425bd1937768b3f3e8f3de9dd5030a29144280d0013355d2b2e23d5c0e58561a6928ddbf99b42c8309079a892c95f3f26a2c452575d407b485c53add2f3bb987a0f1e4354fd228e98afc0061673fec72931f6a26196526cd17ec238792bed1d3821b416d9876bef5bbc1e1cc94591780825c164dca8aa94509d202cdcfa129dd09636336ca65f77ef1197b2c3afc2123b0e25e12558bcaa042c3cffb63c36f83ce40244da551e47e2b7ac79a8582821f42fffbf68964364de28ec9d05a7a37dae41d3085f30546dace957601c9a8b2a0c12bcc0c07892f9aa26c0c329e67665599ce618fe964676f617bc5a938965e8dfc2e554eb0ad4ad6562765b97d0fa8e28591fde4639334139d617bc1bdddeb8b6d653800db16ce2d563e903199ee374422cb57b2e528f85bb4f54052e6f4400095f07888d2d6e6098952c5c46b42d8aa9d6b4b96ef1bab58889bcd18f21f41d045a69cea1f89a8d44a7a724bbc86c115dfd0c30f287cafd891ccd7a8be66a393433791e1294f604f8ff985ff49a7bc6a2a5c6b6589e0768fd637d18046b5aa308331a16459c50214ab758e286af2a6843c4b13f168e840036d2e8a4e254495ec0779dc6cf187008e68712fc81811946aed10fd48b3eee0160185042e47a082fa053cc5abbeb41ed1c5996988bd164e64c71733c7b9732473b523b953b326b0102fe1500014ef33724139068d6c01a94924bfcf66451e44750f5ce90b0bbeb81166f7fc0d5a1b194d162e8a256b64cf30b457f0907f305310513dba7ecdf5f7ab8593b5fc83e3feba36052580f0b3a42bb2547bcba6c7d0fc93e3e3f810c84bb9594f46cb2b4e61894123dd0ee7b56a6dceee858071ff2027ef3cb2286d60c36118b4f8990e1165a8f92f5d083aff62ae5955a4adebebb3fe944d195f32ef9accffde690e3d80768ea210f2b54b4c91da374a7aa6fc76ce85707bff9910481575c820be03af8b4cf9370fc91b6ef8fedcd5cb602371415b43bcc50366056d6fa6e47f510e132c16a5732aa96e31fa821d7dd0035c49e42001887be9020ac43f9479b8d4070cba12c250a78b1d881d21ee2749832b7d9f1726ef464f75ea431c4c513981bd9aecdc3e560b0ef2b317d0c51c5b450b5e2f4b65b61d9f88a7c233b93495eb464d31041b489e084292374d17a45e43b4e170b1cfc27137bbb5da81fd0aee425bf035b77ca176cc860d96430270fa91278fe04320aab66ffd4b8914933d696b4910523bc570d024e332a4a59d891784b34e4ba5b8a53a30a3094c63dca9f2ae2b24bab9795aa55223ef65e1371432fa55675961018d08c113c2825be524eb9f486ace9cb0c0e3702c14c425a606052bb0bd58566f7fe966f327a6ba3a1f3bd0d95b052dd41e27cf91cb636b3568003c82c37ad0dc189225cf07517745f5cc31b874206f560059663ba3cbc61664466d4faeddb2605cda6c54f07c52231d90ad43c8ef896f688547dffade45882d88b75f0a200c7abfcae739a5ef87cf38a090b86cae68be0e9f5b07ee6659c7043736635d1549ebd6c2387f99b5b3c132edd44773813b0c0424402778f35a630e6a353bb06b3caac2415aa250b6fa887273d14f67b06efffc626fccd199dfaa6bf279b8965677c2b69b7797c6a7b697e51a940041ea7a03236de602f7142354ee7a3d593c2e692eb9a8b53c0e6d17067ccf942c84e7e24c867ac4082606acd38b78ea3189c23af2cccf9a73469f9b3afd1054fcdcd5b476f5c6d74d463f8ccba9239ddf34627a7ad5de42e7a7f76ae9018d183d1df13a720ff1c713016a031341cc000eb28c5e3119ee7d97a67d608a143453e92eba1a7e2a8e9ffb528d3030ba3039bbbf870afb0b1fc2c4812057321f67f436628e1333f3ecbc3a8c37cd34f1484007f63c20a712ade370b55ee19c974de7a9a0d5be20a705c8824b59f642fc0321b7c18522b6ca410b93882d390648e188cae3cb63ba48f54d90b9c3dc8c1c72f26948496b905b225736782b4e45e42ec17d5f97d5ad22ba148f990711339488d3557043f6b5dee0bcb2748b3222add4ae6b65086fa180d3ab5955652000150f8be72e0eb77cab769df42103f1e357178c7e78b093d489b4ad34370d7d76e56287a3f0b2041045b16af9f09b3d5cbfd3429444fd808f830fc0404c285475fa3bb859b40f3424f061fbf19c2f4583ea36de065de828610d9337deb3ad9e2b8941c19d02ffe3931d0a84eae640413a0450e74739b777656d678aabe0a501d7f1926e7f8ec53eb5e6d93c49642e2ce4766555c557a8c23b436904a5f05c739aeb03ae638a369d9afaead64e1107d012c53465aeedf5992489796e78677364963d2b1719eddc4fd0ed3fc5224c8dc22d0788386fe061b5e9d4c946297107588a291629ad80cbdbcb8a20dbb328412ee744cbe21f09dd301dbab33e28dc0180739daa27c91d7832798ea95387eab26117fcd26ec60621f316cb7e2975b56d3fa8bd3094879b2889be53a4271f903f356e390180f172af7daef92c1fc280e45ca96e9b0452381bf26228138017a69cf8123855e1fd8a5b1b4e2003b2d527b11182e62053857d99651e394f682e9805d7c626b24a561d896ef0bc581c8b13044f0d4549200ccc821fc72564b9d1a461367a9f60b35be4b559d8a02651751bfe20e346076eaccf8a3700607189b4f4ed2009124f31d5a53360de45cf6ac5555103f4a8e21250a653677cf750f88dca553aac3c64d5a9a2501ac04fd9f57c150efce308796a4639469d9625c7d090e4ce6d169fb4df3295580da26d1800d65e378c467c4a40020425e554fbdc1ba5387a6fcde9add51041871e5d78958555f0b826089e1a8a922b25ed1e05088fea4e3a6e36a0ef62539d98fa8f6efac1e171ed0e48b9f9d7e4d53b46059b40f3424f060ddc765eb38d004892798eaaeacc0fe4b800b02bfe70a4066ed00e81893baa52385a519f922aef69be5e77ddd41ca679b5ccc7549be67f0c32cb3faea078f2817b9597847ffbcc74c4ba28a4622a563b776675808d529196aa0377ed882f7572cf9eab00857ab517785bd3682b8e204803bce65c95ed4381145030ba3039bbbf86fcd08653adc86ab96db0fc8b7f47b1b41b9223b2c42eccde8564ec3739c38b2aa7ecd9a983b75667c51b811408f5c857a13e2009124f31d5a5af4929efda3acbefe02a0849c35064c550f045cc0e169357d837bc1381c2d274e9f391ee68b233eef8ab085cc77f05a05ee38968e2dbee21f9f2a3bdcbdb727d52cb188caabfc02d00003aa1f011f1725e698a5f3e3625cffb7079c68f3643991e018e04a2ac7e93d926ad6ee1e05f43b6e3d170e3d41ebb2f0ea34d0a61c26cdc4bd90a98557640246495557bc02889f04b9d993f5fc85834db92005cd0ca2392e4b15571bcb40cf6503ecefd22cb9f293475781629520c8035c59a5b142cfc21b41e5956af45eb5638ea1fecd4bd784ae2aa4700ea2f000000000);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `productos_vista`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `productos_vista` (
`Cantidad` int
,`Color` varchar(50)
,`Garantia` varchar(100)
,`ID` int
,`Img` longblob
,`Modelo` varchar(100)
,`Moneda` varchar(3)
,`Nombre` varchar(100)
,`Peso` decimal(10,2)
,`Precio` decimal(10,2)
,`Stock_Central` int
,`Stock_Centro` int
,`Stock_Norte` int
,`Tipo` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `suscriptions`
--

CREATE TABLE `suscriptions` (
  `ID` int NOT NULL,
  `correo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_producto`
--

CREATE TABLE `tipo_producto` (
  `ID` int NOT NULL,
  `Nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `tipo_producto`
--

INSERT INTO `tipo_producto` (`ID`, `Nombre`) VALUES
(1, 'Herramientas Eléctricas'),
(2, 'Herramientas Manuales'),
(3, 'Materiales de Construcción'),
(4, 'Ferretería'),
(5, 'Pinturas'),
(6, 'Plomería'),
(7, 'Electricidad'),
(8, 'Jardinería');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(20) NOT NULL DEFAULT 'cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID`, `username`, `password`, `rol`) VALUES
(1, 'admin', 'admin1', 'admin'),
(2, 'bodeguero', 'bodeguero1', 'bodeguero'),
(4, 'luis', 'luis1234', 'cliente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Boletas`
--
ALTER TABLE `Boletas`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Numero_Orden` (`Numero_Orden`),
  ADD KEY `fk_boletas_usuario` (`usuario_id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_Tipo` (`ID_Tipo`);

--
-- Indices de la tabla `suscriptions`
--
ALTER TABLE `suscriptions`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `tipo_producto`
--
ALTER TABLE `tipo_producto`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Boletas`
--
ALTER TABLE `Boletas`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `suscriptions`
--
ALTER TABLE `suscriptions`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_producto`
--
ALTER TABLE `tipo_producto`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

-- --------------------------------------------------------

--
-- Estructura para la vista `productos_vista`
--
DROP TABLE IF EXISTS `productos_vista`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `productos_vista`  AS SELECT `p`.`ID` AS `ID`, `p`.`Nombre` AS `Nombre`, `t`.`Nombre` AS `Tipo`, `p`.`Precio` AS `Precio`, `p`.`Moneda` AS `Moneda`, `p`.`Cantidad` AS `Cantidad`, `p`.`Stock_Central` AS `Stock_Central`, `p`.`Stock_Norte` AS `Stock_Norte`, `p`.`Stock_Centro` AS `Stock_Centro`, `p`.`Peso` AS `Peso`, `p`.`Color` AS `Color`, `p`.`Garantia` AS `Garantia`, `p`.`Modelo` AS `Modelo`, `p`.`Img` AS `Img` FROM (`productos` `p` join `tipo_producto` `t` on((`p`.`ID_Tipo` = `t`.`ID`))) ;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Boletas`
--
ALTER TABLE `Boletas`
  ADD CONSTRAINT `Boletas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`ID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_boletas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`ID`) ON DELETE SET NULL;

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`ID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`ID_Tipo`) REFERENCES `tipo_producto` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
