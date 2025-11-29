"use client";

import { useEffect, useState } from "react";
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
  Empty,
} from "antd";

import { fetchCharacters } from "../api/swapi";
import type { Character } from "../types";
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
  SearchIcon,
} from "lucide-react";
import { animated, useSpring } from "@react-spring/web";
import useIsMobile from "../hooks/useIsMobile";

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

  const cardAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 180, friction: 18 },
  });

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
    <div className="character-list-container">
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">
            <Sparkles size={32} className="hero-icon" />
            Explore os Personagens
          </h2>
          <p className="hero-description">
            Descubra informações detalhadas sobre os personagens icônicos da
            saga Star Wars
          </p>
        </div>
      </section>

      <section className="search-section">
        <div className="search-wrapper">
          <SearchIcon size={20} className="search-icon-prefix" />
          <Search
            // placeholder="Digite o nome do personagem..."
            enterButton="Buscar"
            allowClear
            size="large"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
            onSearch={(value) => {
              setSearchText(value.trim());
              setPage(1);
            }}
            className="search-input-enhanced"
          />
        </div>

        {!loading && (
          <div className="results-info">
            <p className="results-count">
              {total > 0 ? (
                <>
                  Exibindo <strong>{(page - 1) * pageSize + 1}</strong> -{" "}
                  <strong>{Math.min(page * pageSize, total)}</strong> de{" "}
                  <strong>{total}</strong> personagens
                </>
              ) : (
                "Nenhum personagem encontrado"
              )}
            </p>
          </div>
        )}
      </section>

      {/* SKELETON */}
      {loading && (
        <Row gutter={[24, 24]} className="characters-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={6} xl={6}>
              <Card className="character-card skeleton-card">
                <Skeleton active avatar paragraph={{ rows: 4 }} />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!loading && (
        <animated.div style={gridAnimation}>
          {data.length === 0 ? (
            <div className="empty-state">
              <Empty
                description="Nenhum personagem encontrado"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          ) : (
            <>
              <Row gutter={[24, 24]} className="characters-grid">
                {data.map((character, index) => (
                  <Col key={character.url} xs={24} sm={12} md={8} lg={6} xl={6}>
                    <animated.div style={cardAnimation}>
                      <Card
                        hoverable
                        className="character-card"
                        actions={[
                          <Tooltip
                            title="Ver detalhes completos"
                            placement="top"
                            key="details"
                          >
                            <Button
                              type="primary"
                              size={isMobile ? "small" : "middle"}
                              icon={<Eye size={16} />}
                              onClick={() => openDetails(character)}
                              className="details-button"
                            >
                              {!isMobile && "Detalhes"}
                            </Button>
                          </Tooltip>,
                        ]}
                      >
                        <div className="card-header">
                          <div className="card-avatar">
                            <User size={28} />
                          </div>
                          <h3 className="card-title">{character.name}</h3>
                        </div>

                        <div className="card-content">
                          <div className="card-info-row">
                            <Calendar size={16} />
                            <span className="info-label">Nascimento:</span>
                            <span className="info-value">
                              {character.birth_year}
                            </span>
                          </div>

                          <div className="card-info-row">
                            <Users size={16} />
                            <span className="info-label">Gênero:</span>
                            <span className="info-value">
                              {character.gender}
                            </span>
                          </div>

                          <div className="card-tags">
                            <Tag color="purple" className="custom-tag">
                              <Ruler size={12} /> {character.height} cm
                            </Tag>
                            <Tag color="blue" className="custom-tag">
                              <Scale size={12} /> {character.mass} kg
                            </Tag>
                          </div>
                        </div>
                      </Card>
                    </animated.div>
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
                  showTotal={(total) => `Total de ${total} personagens`}
                />
              </div>
            </>
          )}
        </animated.div>
      )}

      {/* ================= DRAWER ================ */}
      <Drawer
        title={
          <div className="drawer-header">
            <Sparkles size={20} />
            <span>{selectedCharacter?.name}</span>
          </div>
        }
        placement="right"
        width={isMobile ? "90%" : 420}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="character-drawer"
      >
        {drawerLoading && (
          <div style={{ padding: 20 }}>
            <Skeleton active paragraph={{ rows: 12 }} />
          </div>
        )}

        {!drawerLoading && selectedCharacter && (
          <animated.div style={drawerAnimation} className="drawer-content">
            {/* === Características === */}
            <div className="drawer-block">
              <h3 className="drawer-block-title">
                <Shapes size={18} /> Características Físicas
              </h3>

              <div className="drawer-info-grid">
                <div className="drawer-info-item">
                  <Ruler size={16} className="drawer-icon" />
                  <div>
                    <span className="drawer-label">Altura</span>
                    <span className="drawer-value">
                      {selectedCharacter.height} cm
                    </span>
                  </div>
                </div>

                <div className="drawer-info-item">
                  <Scale size={16} className="drawer-icon" />
                  <div>
                    <span className="drawer-label">Peso</span>
                    <span className="drawer-value">
                      {selectedCharacter.mass} kg
                    </span>
                  </div>
                </div>

                <div className="drawer-info-item">
                  <User size={16} className="drawer-icon" />
                  <div>
                    <span className="drawer-label">Cabelo</span>
                    <span className="drawer-value">
                      {selectedCharacter.hair_color}
                    </span>
                  </div>
                </div>

                <div className="drawer-info-item">
                  <Palette size={16} className="drawer-icon" />
                  <div>
                    <span className="drawer-label">Pele</span>
                    <span className="drawer-value">
                      {selectedCharacter.skin_color}
                    </span>
                  </div>
                </div>

                <div className="drawer-info-item">
                  <Eye size={16} className="drawer-icon" />
                  <div>
                    <span className="drawer-label">Olhos</span>
                    <span className="drawer-value">
                      {selectedCharacter.eye_color}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* === Identidade === */}
            <div className="drawer-block">
              <h3 className="drawer-block-title">
                <Badge size={18} /> Identidade
              </h3>

              <div className="drawer-info-grid">
                <div className="drawer-info-item">
                  <Calendar size={16} className="drawer-icon" />
                  <div>
                    <span className="drawer-label">Nascimento</span>
                    <span className="drawer-value">
                      {selectedCharacter.birth_year}
                    </span>
                  </div>
                </div>

                <div className="drawer-info-item">
                  <Users size={16} className="drawer-icon" />
                  <div>
                    <span className="drawer-label">Gênero</span>
                    <span className="drawer-value">
                      {selectedCharacter.gender}
                    </span>
                  </div>
                </div>

                <div className="drawer-info-item" data-testid="homeworld">
                  <Globe size={16} className="drawer-icon" />
                  <div>
                    <span className="drawer-label">Mundo Natal</span>
                    <span className="drawer-value">
                      {resolvedHomeworld || "Desconhecido"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* === Filmes === */}
            <div className="drawer-block">
              <h3 className="drawer-block-title">
                <Film size={18} /> Aparições em Filmes
              </h3>
              {resolvedFilms.length > 0 ? (
                <ul className="drawer-list">
                  {resolvedFilms.map((f) => (
                    <li key={f} className="drawer-list-item">
                      <Film size={14} className="list-icon" />
                      {f}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="drawer-empty">Nenhum filme registrado</p>
              )}
            </div>

            <div className="divider" />

            {/* === Veículos === */}
            <div className="drawer-block">
              <h3 className="drawer-block-title">
                <Car size={18} /> Veículos
              </h3>
              {resolvedVehicles.length ? (
                <ul className="drawer-list">
                  {resolvedVehicles.map((v) => (
                    <li key={v} className="drawer-list-item">
                      <Car size={14} className="list-icon" />
                      {v}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="drawer-empty">Nenhum veículo registrado</p>
              )}
            </div>

            <div className="divider" />

            {/* === Naves === */}
            <div className="drawer-block">
              <h3 className="drawer-block-title">
                <Ship size={18} /> Naves Espaciais
              </h3>
              {resolvedStarships.length ? (
                <ul className="drawer-list">
                  {resolvedStarships.map((s) => (
                    <li key={s} className="drawer-list-item">
                      <Ship size={14} className="list-icon" />
                      {s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="drawer-empty">Nenhuma nave registrada</p>
              )}
            </div>

            <div className="divider" />

            {/* === Espécies === */}
            <div className="drawer-block">
              <h3 className="drawer-block-title">
                <Users size={18} /> Espécies
              </h3>
              {resolvedSpecies.length ? (
                <ul className="drawer-list">
                  {resolvedSpecies.map((sp) => (
                    <li key={sp} className="drawer-list-item">
                      <Sparkles size={14} className="list-icon" />
                      {sp}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="drawer-empty">Humano (padrão)</p>
              )}
            </div>

            <div className="divider" />

            {/* === Timeline === */}
            <div className="drawer-block">
              <h3 className="drawer-block-title">
                <Clock size={18} />
                Histórico de Registros
              </h3>
              <Timeline className="custom-timeline">
                <Timeline.Item color="blue">
                  <strong>Criado em:</strong>
                  <br />
                  <span className="timeline-date">
                    {new Date(selectedCharacter.created).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </Timeline.Item>
                <Timeline.Item color="purple">
                  <strong>Última atualização:</strong>
                  <br />
                  <span className="timeline-date">
                    {new Date(selectedCharacter.edited).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </Timeline.Item>
              </Timeline>
            </div>
          </animated.div>
        )}
      </Drawer>
    </div>
  );
}
