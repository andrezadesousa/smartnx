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
        title={selectedCharacter?.name}
        placement="left"
        width={340}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {selectedCharacter && (
          <div style={{ lineHeight: "28px" }}>
            <p>
              <VerticalAlignMiddleOutlined /> <strong>Altura:</strong>{" "}
              {selectedCharacter.height}
            </p>

            <p>
              <ColumnHeightOutlined /> <strong>Peso:</strong>{" "}
              {selectedCharacter.mass}
            </p>

            <p>
              <SkinOutlined /> <strong>Cor do Cabelo:</strong>{" "}
              {selectedCharacter.hair_color}
            </p>

            <p>
              <BgColorsOutlined /> <strong>Cor da Pele:</strong>{" "}
              {selectedCharacter.skin_color}
            </p>

            <p>
              <EyeOutlined /> <strong>Cor dos Olhos:</strong>{" "}
              {selectedCharacter.eye_color}
            </p>

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

            <p>
              <VideoCameraOutlined /> <strong>Filmes:</strong>
            </p>
            <ul>
              {selectedCharacter.films.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <p>
              <CarOutlined /> <strong>Veículos:</strong>
            </p>
            <ul>
              {selectedCharacter.vehicles.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>

            <p>
              <ApartmentOutlined /> <strong>Naves:</strong>
            </p>
            <ul>
              {selectedCharacter.starships.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            <p>
              <ClockCircleOutlined /> <strong>Criado Em:</strong>{" "}
              {selectedCharacter.created}
            </p>

            <p>
              <ClockCircleOutlined /> <strong>Editado Em:</strong>{" "}
              {selectedCharacter.edited}
            </p>
          </div>
        )}
      </Drawer>
    </>
  );
}
