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
} from "antd";
import { fetchCharacters } from "../api/swapi";
import type { Character } from "../types";
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
import useIsMobile from "../hooks/useUsMobile";
import { fetchResourceName } from "../utils/fetchResourceName";

const { Search } = Input;

export default function CharacterList() {
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const isMobile = useIsMobile(600);
  const [resolvedHomeworld, setResolvedHomeworld] = useState<string>("");
  const [resolvedFilms, setResolvedFilms] = useState<string[]>([]);
  const [resolvedSpecies, setResolvedSpecies] = useState<string[]>([]);
  const [resolvedVehicles, setResolvedVehicles] = useState<string[]>([]);
  const [resolvedStarships, setResolvedStarships] = useState<string[]>([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

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

  useEffect(() => {
    if (!selectedCharacter) return;

    const loadData = async () => {
      // 🌍 planeta
      if (selectedCharacter.homeworld) {
        const name = await fetchResourceName(selectedCharacter.homeworld);
        setResolvedHomeworld(name);
      }

      // 🎬 filmes
      if (selectedCharacter.films?.length) {
        const names = await Promise.all(
          selectedCharacter.films.map((url) => fetchResourceName(url))
        );
        setResolvedFilms(names);
      }

      // 🧬 espécies
      if (selectedCharacter.species?.length) {
        const names = await Promise.all(
          selectedCharacter.species.map((url) => fetchResourceName(url))
        );
        setResolvedSpecies(names);
      }

      // 🚗 veículos
      if (selectedCharacter.vehicles?.length) {
        const names = await Promise.all(
          selectedCharacter.vehicles.map((url) => fetchResourceName(url))
        );
        setResolvedVehicles(names);
      }

      // 🚀 naves
      if (selectedCharacter.starships?.length) {
        const names = await Promise.all(
          selectedCharacter.starships.map((url) => fetchResourceName(url))
        );
        setResolvedStarships(names);
      }
    };

    loadData();
  }, [selectedCharacter]);

  const openDetails = (character: Character) => {
    setSelectedCharacter(character);
    setDrawerOpen(true);
  };

  return (
    <>
      <Card title="Star Wars — Personagens" className="card-wrapper">
        <div>
          <Search
            placeholder="Filtrar por nome"
            enterButton
            allowClear
            onSearch={(value) => {
              setPage(1);
              setSearchText(value.trim());
            }}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading-spinner" aria-busy>
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin />
            </div>
          </div>
        ) : (
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

      <Drawer
        title={<span className="drawer-title">{selectedCharacter?.name}</span>}
        placement="left"
        width={360}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="character-drawer"
      >
        {selectedCharacter && (
          <div className="drawer-content">
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
                <UserOutlined /> Identidade
              </h3>

              <p>
                <CalendarOutlined /> <strong>Nascimento:</strong>{" "}
                {selectedCharacter.birth_year}
              </p>

              <p>
                <UserOutlined /> <strong>Gênero:</strong>{" "}
                {selectedCharacter.gender}
              </p>

              <p>
                <GlobalOutlined /> <strong>Mundo Natal:</strong>{" "}
                {resolvedHomeworld || "Desconhecido"}
              </p>
            </div>

            <div className="divider" />

            <div className="drawer-block">
              <h3 className="drawer-title">
                <VideoCameraOutlined /> Filmes
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
                <CarOutlined /> Veículos
              </h3>
              {selectedCharacter.vehicles.length > 0 ? (
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
                <ApartmentOutlined /> Naves
              </h3>
              {selectedCharacter.starships.length > 0 ? (
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
