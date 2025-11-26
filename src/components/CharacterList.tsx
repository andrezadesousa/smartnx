import React, { useEffect, useState } from "react";
import { Table, Input, Row, Col, Pagination, Card, Spin } from "antd";
import { fetchCharacters, Character } from "../api/swapi";

const { Search } = Input;

export default function CharacterList() {
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const pageSize = 10; // requisito: 10 por página

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

  const columns = [
    { title: "Nome", dataIndex: "name", key: "name" },
    { title: "Ano de Nascimento", dataIndex: "birth_year", key: "birth_year" },
    { title: "Gênero", dataIndex: "gender", key: "gender" },
    { title: "Altura", dataIndex: "height", key: "height" },
    { title: "Peso", dataIndex: "mass", key: "mass" },
  ];

  return (
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
  );
}
