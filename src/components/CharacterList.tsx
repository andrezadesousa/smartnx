import React, { useEffect, useState } from "react";
import {
  Input,
  Row,
  Col,
  Pagination,
  Card,
  Spin,
  Drawer,
  Tag,
  Tooltip,
  Button,
  Timeline,
  Skeleton,
} from "antd";

import { fetchCharacters } from "../api/swapi";
import type { Character } from "../types";

import useIsMobile from "../hooks/useUsMobile";
import { fetchResourceName } from "../utils/fetchResourceName";

// 🔥 Ícones Ant Design (mantidos)
import {
  VerticalAlignMiddleOutlined,
  ColumnHeightOutlined,
  SkinOutlined,
  BgColorsOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  GlobalOutlined,
  VideoCameraOutlined,
  CarOutlined,
  ClockCircleOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

// 🔥 Novos ícones modernos (lucide-react)
import {
  User as UserIcon,
  Globe,
  Film,
  Car,
  Ship,
  Sparkles,
} from "lucide-react";

const { Search } = Input;

export default function CharacterList() {
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const isMobile = useIsMobile(600);

  const [resolvedHomeworld, setResolvedHomeworld] = useState("");
  const [resolvedFilms, setResolvedFilms] = useState<string[]>([]);
  const [resolvedSpecies, setResolvedSpecies] = useState<string[]>([]);
  const [resolvedVehicles, setResolvedVehicles] = useState<string[]>([]);
  const [resolvedStarships, setResolvedStarships] = useState<string[]>([]);

  const pageSize = 10;

  useEffect(() => {
    load(page, searchText);
  }, [page, searchText]);

  async function load(p = 1, search = "") {
    setLoading(true);
    try {
      const res = await fetchCharacters(p, search);
      setData(res.results);
      setTotal(res.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // 🔥 Abrir Drawer
  const openDetails = (character: Character) => {
    setSelectedCharacter(character);
    setDrawerOpen(true);
  };

  // 🔥 Resolver nomes quando Drawer abre
  useEffect(() => {
    if (!selectedCharacter) return;

    const loadData = async () => {
      setDrawerLoading(true);

      if (selectedCharacter.homeworld) {
        const name = await fetchResourceName(selectedCharacter.homeworld);
        setResolvedHomeworld(name);
      }

      if (selectedCharacter.films?.length) {
        const names = await Promise.all(
          selectedCharacter.films.map((url) => fetchResourceName(url))
        );
        setResolvedFilms(names);
      }

      if (selectedCharacter.species?.length) {
        const names = await Promise.all(
          selectedCharacter.species.map((url) => fetchResourceName(url))
        );
        setResolvedSpecies(names);
      }

      if (selectedCharacter.vehicles?.length) {
        const names = await Promise.all(
          selectedCharacter.vehicles.map((url) => fetchResourceName(url))
        );
        setResolvedVehicles(names);
      }

      if (selectedCharacter.starships?.length) {
        const names = await Promise.all(
          selectedCharacter.starships.map((url) => fetchResourceName(url))
        );
        setResolvedStarships(names);
      }

      setDrawerLoading(false);
    };

    loadData();
  }, [selectedCharacter]);

  return (
    <>
      <Card title="Star Wars — Personagens" className="card-wrapper">
        {/* 🔥 Search Dinâmico */}
        <Search
          placeholder="Filtrar por nome"
          enterButton
          allowClear
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
          onSearch={(value) => {
            setSearchText(value.trim());
            setPage(1);
          }}
          className="search-input"
        />

        {/* 🔥 Skeleton dos Cards */}
        {loading && (
          <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Col key={i} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card className="character-card">
                  <Skeleton active avatar paragraph={{ rows: 3 }} />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Conteúdo quando não está carregando */}
        {!loading && (
          <>
            <Row gutter={[16, 16]}>
              {data.map((character) => (
                <Col key={character.url} xs={24} sm={12} md={8} lg={6} xl={6}>
                  <Card
                    hoverable
                    className="character-card"
                    title={<div className="card-title">{character.name}</div>}
                    actions={[
                      isMobile ? (
                        <EyeOutlined
                          key="details-mobile"
                          onClick={() => openDetails(character)}
                        />
                      ) : (
                        <Tooltip
                          title="Ver detalhes"
                          placement="top"
                          key="details-desktop"
                        >
                          <Button
                            type="primary"
                            onClick={() => openDetails(character)}
                            size="small"
                          >
                            Detalhes
                          </Button>
                        </Tooltip>
                      ),
                    ]}
                  >
                    <div className="card-content">
                      <p>
                        <CalendarOutlined /> <strong>Nascimento:</strong>{" "}
                        {character.birth_year}
                      </p>

                      <p>
                        <UserOutlined /> <strong>Gênero:</strong>{" "}
                        {character.gender}
                      </p>

                      <Tag color="gold">Altura: {character.height} cm</Tag>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="pagination-wrapper">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={(p) => setPage(p)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Card>

      {/* === 🔥 DRAWER === */}
      <Drawer
        title={
          <span className="drawer-title">
            <Sparkles size={16} style={{ marginRight: 8 }} />
            {selectedCharacter?.name}
          </span>
        }
        placement="right"
        width={360}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="character-drawer"
      >
        {/* 🔥 Skeleton dentro do Drawer */}
        {drawerLoading && (
          <div style={{ padding: 20 }}>
            <Skeleton active paragraph={{ rows: 10 }} />
          </div>
        )}

        {/* Conteúdo real */}
        {!drawerLoading && selectedCharacter && (
          <div className="drawer-content">
            {/* 🔥 Manter TODA a estrutura ORIGINAL */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <ColumnHeightOutlined /> Características
              </h3>

              <p>
                <VerticalAlignMiddleOutlined /> <strong>Altura:</strong>{" "}
                {selectedCharacter.height} cm
              </p>
              <p>
                <ColumnHeightOutlined /> <strong>Peso:</strong>{" "}
                {selectedCharacter.mass} kg
              </p>
              <p>
                <UserOutlined /> <strong>Cor do Cabelo:</strong>{" "}
                {selectedCharacter.hair_color}
              </p>
              <p>
                <SkinOutlined /> <strong>Cor da Pele:</strong>{" "}
                {selectedCharacter.skin_color}
              </p>
              <p>
                <BgColorsOutlined /> <strong>Cor dos Olhos:</strong>{" "}
                {selectedCharacter.eye_color}
              </p>
            </div>

            <div className="divider" />

            <div className="drawer-block">
              <h3 className="drawer-title">
                <UserIcon size={16} /> Identidade
              </h3>

              <p>
                <CalendarOutlined /> <strong>Nascimento:</strong>{" "}
                {selectedCharacter.birth_year}
              </p>

              <p>
                <UserOutlined /> <strong>Gênero:</strong>{" "}
                {selectedCharacter.gender}
              </p>

              <p data-testid="homeworld">
                <Globe size={16} /> <strong>Mundo Natal:</strong>{" "}
                {resolvedHomeworld || "Desconhecido"}
              </p>
            </div>

            <div className="divider" />

            <div className="drawer-block">
              <h3 className="drawer-title">
                <Film size={16} /> Filmes
              </h3>
              <ul className="drawer-list">
                {resolvedFilms.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <div className="divider" />

            <div className="drawer-block">
              <h3 className="drawer-title">
                <Car size={16} /> Veículos
              </h3>
              {resolvedVehicles.length > 0 ? (
                <ul className="drawer-list">
                  {resolvedVehicles.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum veículo registrado.</p>
              )}
            </div>

            <div className="divider" />

            <div className="drawer-block">
              <h3 className="drawer-title">
                <Ship size={16} /> Naves
              </h3>
              {resolvedStarships.length > 0 ? (
                <ul className="drawer-list">
                  {resolvedStarships.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma nave registrada.</p>
              )}
            </div>

            <div className="divider" />

            <div className="drawer-block">
              <h3 className="drawer-title">
                <ApartmentOutlined /> Espécies
              </h3>
              {resolvedSpecies.length > 0 ? (
                resolvedSpecies.map((sp) => <li key={sp}>{sp}</li>)
              ) : (
                <p>Sem espécies cadastradas.</p>
              )}
            </div>

            <div className="divider" />

            <div className="drawer-block">
              <h3 className="drawer-title">
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Linha do Tempo
              </h3>
              <Timeline style={{ marginLeft: 20, marginTop: 20 }}>
                <Timeline.Item color="blue">
                  <strong>Criado Em:</strong> {selectedCharacter.created}
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <strong>Editado Em:</strong>
                  {selectedCharacter.edited}
                </Timeline.Item>
              </Timeline>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
