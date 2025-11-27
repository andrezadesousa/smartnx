import React, { useEffect, useState } from "react";
import { Table, Input, Row, Col, Pagination, Card, Spin, Drawer } from "antd";
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

const { Search } = Input;

export default function CharacterList() {
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");

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

  const showDetails = (record: Character) => {
    setSelectedCharacter(record);
    setDrawerOpen(true);
  };

  const columns = [
    { title: "Nome", dataIndex: "name", key: "name" },
    { title: "Ano de Nascimento", dataIndex: "birth_year", key: "birth_year" },
    { title: "Gênero", dataIndex: "gender", key: "gender" },

    {
      title: "Detalhes",
      key: "details",
      render: (_: any, record: Character) => (
        <EyeOutlined
          style={{ cursor: "pointer", fontSize: 18 }}
          onClick={() => showDetails(record)}
        />
      ),
    },
  ];

  return (
    <>
      <Card title="Star Wars — Personagens" style={{ margin: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Search
              placeholder="Filtrar por nome"
              enterButton
              allowClear
              onSearch={(value) => {
                setPage(1);
                setSearchText(value.trim());
              }}
            />
          </Col>

          <Col xs={24}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Spin />
              </div>
            ) : (
              <>
                <Table
                  dataSource={data}
                  columns={columns}
                  rowKey="url"
                  pagination={false}
                  scroll={{ x: "max-content" }}
                  size="middle"
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 16,
                  }}
                >
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
          </Col>
        </Row>
      </Card>

      {/* DRAWER */}
      <Drawer
        title={
          <span
            style={{
              fontFamily: "var(--body-font)",
              color: "var(--accent-700)",
              fontSize: 20,
            }}
          >
            {selectedCharacter?.name}
          </span>
        }
        placement="left"
        width={360}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        bodyStyle={{
          background: "var(--bg-900)",
          color: "var(--neutral-100)",
          fontFamily: "var(--body-font)",
        }}
      >
        {selectedCharacter && (
          <div style={{ paddingBottom: 20 }}>
            {/* BLOCO 1 — CARACTERÍSTICAS FÍSICAS */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <ColumnHeightOutlined style={{ marginRight: 8 }} />
                Características
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

              <div className="divider" />
            </div>

            {/* BLOCO 2 — IDENTIDADE */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <UserOutlined style={{ marginRight: 8 }} />
                Identidade
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
                {selectedCharacter.homeworld}
              </p>

              <div className="divider" />
            </div>

            {/* BLOCO 3 — FILMES */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <VideoCameraOutlined style={{ marginRight: 8 }} />
                Filmes
              </h3>

              <ul className="drawer-list">
                {selectedCharacter.films.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>

              <div className="divider" />
            </div>

            {/* BLOCO 4 — VEÍCULOS */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <CarOutlined style={{ marginRight: 8 }} />
                Veículos
              </h3>

              {selectedCharacter.vehicles.length > 0 ? (
                <ul className="drawer-list">
                  {selectedCharacter.vehicles.map((v) => (
                    <li key={v}>• {v}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum veículo registrado.</p>
              )}

              <div className="divider" />
            </div>

            {/* BLOCO 5 — NAVES */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <ApartmentOutlined style={{ marginRight: 8 }} />
                Naves
              </h3>

              {selectedCharacter.starships.length > 0 ? (
                <ul className="drawer-list">
                  {selectedCharacter.starships.map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma nave registrada.</p>
              )}

              <div className="divider" />
            </div>

            {/* BLOCO 6 — DATAS */}
            <div className="drawer-block">
              <h3 className="drawer-title">
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Datas
              </h3>

              <p>
                <ClockCircleOutlined /> <strong>Criado Em:</strong>{" "}
                {selectedCharacter.created}
              </p>

              <p>
                <ClockCircleOutlined /> <strong>Editado Em:</strong>{" "}
                {selectedCharacter.edited}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
