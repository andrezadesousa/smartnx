import React, { useEffect, useState } from "react";
import {
  Input,
  Row,
  Col,
  Pagination,
  Card,
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

// ⭐ Lucide Icons
import {
  User,
  Globe,
  Film,
  Car,
  Ship,
  Sparkles,
  Ruler,
  Scale,
  Palette,
  Eye,
  Calendar,
  Badge,
  Clock,
  Users,
  Shapes,
} from "lucide-react";
import { animated, useSpring } from "@react-spring/web";

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

  const openDetails = (character: Character) => {
    setSelectedCharacter(character);
    setDrawerOpen(true);
  };

  // Carregar informações do drawer
  useEffect(() => {
    if (!selectedCharacter) return;

    const loadData = async () => {
      setDrawerLoading(true);

      if (selectedCharacter.homeworld) {
        setResolvedHomeworld(
          await fetchResourceName(selectedCharacter.homeworld)
        );
      }

      if (selectedCharacter.films?.length) {
        setResolvedFilms(
          await Promise.all(
            selectedCharacter.films.map((url) => fetchResourceName(url))
          )
        );
      }

      if (selectedCharacter.species?.length) {
        setResolvedSpecies(
          await Promise.all(
            selectedCharacter.species.map((url) => fetchResourceName(url))
          )
        );
      }

      if (selectedCharacter.vehicles?.length) {
        setResolvedVehicles(
          await Promise.all(
            selectedCharacter.vehicles.map((url) => fetchResourceName(url))
          )
        );
      }

      if (selectedCharacter.starships?.length) {
        setResolvedStarships(
          await Promise.all(
            selectedCharacter.starships.map((url) => fetchResourceName(url))
          )
        );
      }

      setDrawerLoading(false);
    };

    loadData();
  }, [selectedCharacter]);

  // ⭐ ANIMAÇÃO: Fade + Slide Up (Drawer Content)
  const drawerAnimation = useSpring({
    opacity: drawerOpen ? 1 : 0,
    transform: drawerOpen ? "translateY(0px)" : "translateY(20px)",
    config: { tension: 220, friction: 22 },
  });

  // ⭐ ANIMAÇÃO: Fade-in da grid após loading
  const gridAnimation = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? "translateY(10px)" : "translateY(0)",
    config: { tension: 210, friction: 20 },
  });

  return (
    <>
      <Card title="Star Wars — Personagens" className="card-wrapper">
        {/* 🔍 SEARCH */}
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

        {/* SKELETON */}
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

        {!loading && (
          <animated.div style={gridAnimation}>
            <Row gutter={[16, 16]}>
              {data.map((character) => (
                <Col key={character.url} xs={24} sm={12} md={8} lg={6} xl={6}>
                  <Card
                    hoverable
                    className="character-card"
                    title={<div className="card-title">{character.name}</div>}
                    actions={[
                      isMobile ? (
                        <Eye
                          key="details-mobile"
                          size={20}
                          onClick={() => openDetails(character)}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <Tooltip title="Ver detalhes" placement="top" key="d1">
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => openDetails(character)}
                          >
                            Detalhes
                          </Button>
                        </Tooltip>
                      ),
                    ]}
                  >
                    <div className="card-content">
                      <p>
                        <Calendar size={14} /> <strong>Nascimento:</strong>{" "}
                        {character.birth_year}
                      </p>

                      <p>
                        <Users size={14} /> <strong>Gênero:</strong>{" "}
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
          </animated.div>
        )}
      </Card>

      {/* ================= DRAWER ================ */}
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
        {drawerLoading && (
          <div style={{ padding: 20 }}>
            <Skeleton active paragraph={{ rows: 10 }} />
          </div>
        )}

        {!drawerLoading && selectedCharacter && (
          <animated.div style={drawerAnimation} className="drawer-content">
            {/* === Características === */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <Shapes size={16} /> Características
              </h3>

              <p>
                <Ruler size={14} /> <strong>Altura:</strong>{" "}
                {selectedCharacter.height} cm
              </p>
              <p>
                <Scale size={14} /> <strong>Peso:</strong>{" "}
                {selectedCharacter.mass} kg
              </p>
              <p>
                <User size={14} /> <strong>Cabelo:</strong>{" "}
                {selectedCharacter.hair_color}
              </p>
              <p>
                <Palette size={14} /> <strong>Pele:</strong>{" "}
                {selectedCharacter.skin_color}
              </p>
              <p>
                <Palette size={14} /> <strong>Olhos:</strong>{" "}
                {selectedCharacter.eye_color}
              </p>
            </div>

            <div className="divider" />

            {/* === Identidade === */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <Badge size={16} /> Identidade
              </h3>

              <p>
                <Calendar size={14} /> <strong>Nascimento:</strong>{" "}
                {selectedCharacter.birth_year}
              </p>

              <p>
                <Users size={14} /> <strong>Gênero:</strong>{" "}
                {selectedCharacter.gender}
              </p>

              <p data-testid="homeworld">
                <Globe size={14} /> <strong>Mundo Natal:</strong>{" "}
                {resolvedHomeworld || "Desconhecido"}
              </p>
            </div>

            <div className="divider" />

            {/* === Filmes === */}
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

            {/* === Veículos === */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <Car size={16} /> Veículos
              </h3>
              {resolvedVehicles.length ? (
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

            {/* === Naves === */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <Ship size={16} /> Naves
              </h3>
              {resolvedStarships.length ? (
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

            {/* === Espécies === */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <Users size={16} /> Espécies
              </h3>
              {resolvedSpecies.length ? (
                <ul className="drawer-list">
                  {resolvedSpecies.map((sp) => (
                    <li key={sp}>{sp}</li>
                  ))}
                </ul>
              ) : (
                <p>Sem espécies cadastradas.</p>
              )}
            </div>

            <div className="divider" />

            {/* === Timeline === */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <Clock size={16} style={{ marginRight: 8 }} />
                Linha do Tempo
              </h3>
              <Timeline style={{ marginLeft: 20, marginTop: 20 }}>
                <Timeline.Item color="blue">
                  <strong>Criado Em:</strong> {selectedCharacter.created}
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <strong>Editado Em:</strong> {selectedCharacter.edited}
                </Timeline.Item>
              </Timeline>
            </div>
          </animated.div>
        )}
      </Drawer>
    </>
  );
}
