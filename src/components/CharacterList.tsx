"use client";

import { useEffect, useState } from "react";
import {
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
import styled from "styled-components";
import { fetchCharacters } from "../api/swapi";
import type { Character } from "../types";
import { fetchResourceName } from "../utils/fetchResourceName";
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
import useIsMobile from "../hooks/useIsMobile";

interface CharacterListProps {
  searchQuery: string;
  onLoadingChange?: (loading: boolean) => void;
}

export default function CharacterList({
  searchQuery,
  onLoadingChange,
}: CharacterListProps) {
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
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
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    load(page, searchQuery);
  }, [page, searchQuery]);

  async function load(p = 1, search = "") {
    setLoading(true);
    if (onLoadingChange) onLoadingChange(true);
    try {
      const res = await fetchCharacters(p, search);
      setData(res.results);
      setTotal(res.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
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

  const drawerAnimation = useSpring({
    opacity: drawerOpen ? 1 : 0,
    transform: drawerOpen ? "translateY(0px)" : "translateY(20px)",
    config: { tension: 220, friction: 22 },
  });

  const gridAnimation = useSpring({
    opacity: loading ? 0 : 1,
    transform: loading ? "translateY(10px)" : "translateY(0)",
    config: { tension: 210, friction: 20 },
  });

  return (
    <CharacterListContainer>
      <SearchSection>
        {!loading && (
          <ResultsInfo>
            <ResultsCount>
              {total > 0 ? (
                <>
                  Exibindo <strong>{(page - 1) * pageSize + 1}</strong> -{" "}
                  <strong>{Math.min(page * pageSize, total)}</strong> de{" "}
                  <strong>{total}</strong> personagens
                </>
              ) : null}
            </ResultsCount>
          </ResultsInfo>
        )}
      </SearchSection>

      {loading && (
        <CharactersGrid gutter={[24, 24]}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={6} xl={6}>
              <StyledCard className="character-card skeleton-card">
                <Skeleton active avatar paragraph={{ rows: 4 }} />
              </StyledCard>
            </Col>
          ))}
        </CharactersGrid>
      )}

      {!loading && (
        <animated.div style={gridAnimation}>
          {data.length === 0 ? (
            <EmptyState>
              <Empty description="Nenhum personagem encontrado" />
            </EmptyState>
          ) : (
            <>
              <CharactersGrid gutter={[24, 24]}>
                {data.map((character, index) => (
                  <Col key={character.url} xs={24} sm={12} md={8} lg={6} xl={6}>
                    <animated.div style={cardAnimation}>
                      <StyledCard hoverable className="character-card">
                        <Tooltip title="Ver detalhes completos" placement="top">
                          <DetailsButton
                            type="link"
                            icon={<Eye size={18} />}
                            onClick={() => openDetails(character)}
                            className="details-button"
                          />
                        </Tooltip>

                        <CardHeader>
                          <CardAvatar>
                            <User size={28} />
                          </CardAvatar>
                          <CardTitle>{character.name}</CardTitle>
                        </CardHeader>

                        <CardContent>
                          <CardInfoRow>
                            <Calendar size={16} />
                            <InfoLabel>Nascimento:</InfoLabel>
                            <InfoValue>{character.birth_year}</InfoValue>
                          </CardInfoRow>

                          <CardInfoRow>
                            <Users size={16} />
                            <InfoLabel>Gênero:</InfoLabel>
                            <InfoValue>{character.gender}</InfoValue>
                          </CardInfoRow>

                          <CardTags>
                            <CustomTag color="purple" className="custom-tag">
                              <Ruler size={12} /> {character.height} cm
                            </CustomTag>
                            <CustomTag color="blue" className="custom-tag">
                              <Scale size={12} /> {character.mass} kg
                            </CustomTag>
                          </CardTags>
                        </CardContent>
                      </StyledCard>
                    </animated.div>
                  </Col>
                ))}
              </CharactersGrid>

              <PaginationWrapper>
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={(p) => setPage(p)}
                  showSizeChanger={false}
                  showTotal={(total) => `Total de ${total} personagens`}
                />
              </PaginationWrapper>
            </>
          )}
        </animated.div>
      )}

      {/* ================= DRAWER ================ */}
      <StyledDrawer
        title={
          <DrawerHeader>
            <Sparkles size={20} />
            <span>{selectedCharacter?.name}</span>
          </DrawerHeader>
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
          <DrawerContent style={drawerAnimation}>
            {/* === Características === */}
            <DrawerBlock>
              <DrawerBlockTitle>
                <Shapes size={18} /> Características Físicas
              </DrawerBlockTitle>

              <DrawerInfoGrid>
                <DrawerInfoItem>
                  <DrawerIcon>
                    <Ruler size={16} />
                  </DrawerIcon>
                  <div>
                    <DrawerLabel>Altura</DrawerLabel>
                    <DrawerValue>{selectedCharacter.height} cm</DrawerValue>
                  </div>
                </DrawerInfoItem>

                <DrawerInfoItem>
                  <DrawerIcon>
                    <Scale size={16} />
                  </DrawerIcon>
                  <div>
                    <DrawerLabel>Peso</DrawerLabel>
                    <DrawerValue>{selectedCharacter.mass} kg</DrawerValue>
                  </div>
                </DrawerInfoItem>

                <DrawerInfoItem>
                  <DrawerIcon>
                    <User size={16} />
                  </DrawerIcon>
                  <div>
                    <DrawerLabel>Cabelo</DrawerLabel>
                    <DrawerValue>{selectedCharacter.hair_color}</DrawerValue>
                  </div>
                </DrawerInfoItem>

                <DrawerInfoItem>
                  <DrawerIcon>
                    <Palette size={16} />
                  </DrawerIcon>
                  <div>
                    <DrawerLabel>Pele</DrawerLabel>
                    <DrawerValue>{selectedCharacter.skin_color}</DrawerValue>
                  </div>
                </DrawerInfoItem>

                <DrawerInfoItem>
                  <DrawerIcon>
                    <Eye size={16} />
                  </DrawerIcon>
                  <div>
                    <DrawerLabel>Olhos</DrawerLabel>
                    <DrawerValue>{selectedCharacter.eye_color}</DrawerValue>
                  </div>
                </DrawerInfoItem>
              </DrawerInfoGrid>
            </DrawerBlock>

            <Divider />

            {/* === Identidade === */}
            <DrawerBlock>
              <DrawerBlockTitle>
                <Badge size={18} /> Identidade
              </DrawerBlockTitle>

              <DrawerInfoGrid>
                <DrawerInfoItem>
                  <DrawerIcon>
                    <Calendar size={16} />
                  </DrawerIcon>
                  <div>
                    <DrawerLabel>Nascimento</DrawerLabel>
                    <DrawerValue>{selectedCharacter.birth_year}</DrawerValue>
                  </div>
                </DrawerInfoItem>

                <DrawerInfoItem>
                  <DrawerIcon>
                    <Users size={16} />
                  </DrawerIcon>
                  <div>
                    <DrawerLabel>Gênero</DrawerLabel>
                    <DrawerValue>{selectedCharacter.gender}</DrawerValue>
                  </div>
                </DrawerInfoItem>

                <DrawerInfoItem data-testid="homeworld">
                  <DrawerIcon>
                    <Globe size={16} />
                  </DrawerIcon>
                  <div>
                    <DrawerLabel>Mundo Natal</DrawerLabel>
                    <DrawerValue>
                      {resolvedHomeworld || "Desconhecido"}
                    </DrawerValue>
                  </div>
                </DrawerInfoItem>
              </DrawerInfoGrid>
            </DrawerBlock>

            <Divider />

            {/* === Filmes === */}
            <DrawerBlock>
              <DrawerBlockTitle>
                <Film size={18} /> Aparições em Filmes
              </DrawerBlockTitle>
              {resolvedFilms.length > 0 ? (
                <DrawerList>
                  {resolvedFilms.map((f) => (
                    <DrawerListItem key={f}>
                      <ListIcon>
                        <Film size={14} />
                      </ListIcon>
                      {f}
                    </DrawerListItem>
                  ))}
                </DrawerList>
              ) : (
                <DrawerEmpty>Nenhum filme registrado</DrawerEmpty>
              )}
            </DrawerBlock>

            <Divider />

            {/* === Veículos === */}
            <DrawerBlock>
              <DrawerBlockTitle>
                <Car size={18} /> Veículos
              </DrawerBlockTitle>
              {resolvedVehicles.length ? (
                <DrawerList>
                  {resolvedVehicles.map((v) => (
                    <DrawerListItem key={v}>
                      <ListIcon>
                        <Car size={14} />
                      </ListIcon>
                      {v}
                    </DrawerListItem>
                  ))}
                </DrawerList>
              ) : (
                <DrawerEmpty>Nenhum veículo registrado</DrawerEmpty>
              )}
            </DrawerBlock>

            <Divider />

            {/* === Naves === */}
            <DrawerBlock>
              <DrawerBlockTitle>
                <Ship size={18} /> Naves Espaciais
              </DrawerBlockTitle>
              {resolvedStarships.length ? (
                <DrawerList>
                  {resolvedStarships.map((s) => (
                    <DrawerListItem key={s}>
                      <ListIcon>
                        <Ship size={14} />
                      </ListIcon>
                      {s}
                    </DrawerListItem>
                  ))}
                </DrawerList>
              ) : (
                <DrawerEmpty>Nenhuma nave registrada</DrawerEmpty>
              )}
            </DrawerBlock>

            <Divider />

            {/* === Espécies === */}
            <DrawerBlock>
              <DrawerBlockTitle>
                <Users size={18} /> Espécies
              </DrawerBlockTitle>
              {resolvedSpecies.length ? (
                <DrawerList>
                  {resolvedSpecies.map((sp) => (
                    <DrawerListItem key={sp}>
                      <ListIcon>
                        <Sparkles size={14} />
                      </ListIcon>
                      {sp}
                    </DrawerListItem>
                  ))}
                </DrawerList>
              ) : (
                <DrawerEmpty>Humano (padrão)</DrawerEmpty>
              )}
            </DrawerBlock>

            <Divider />

            {/* === Timeline === */}
            <DrawerBlock>
              <DrawerBlockTitle>
                <Clock size={18} />
                Histórico de Registros
              </DrawerBlockTitle>
              <CustomTimeline className="custom-timeline">
                <Timeline.Item color="blue">
                  <strong>Criado em:</strong>
                  <br />
                  <TimelineDate>
                    {new Date(selectedCharacter.created).toLocaleDateString(
                      "pt-BR"
                    )}
                  </TimelineDate>
                </Timeline.Item>
                <Timeline.Item color="purple">
                  <strong>Última atualização:</strong>
                  <br />
                  <TimelineDate>
                    {new Date(selectedCharacter.edited).toLocaleDateString(
                      "pt-BR"
                    )}
                  </TimelineDate>
                </Timeline.Item>
              </CustomTimeline>
            </DrawerBlock>
          </DrawerContent>
        )}
      </StyledDrawer>
    </CharacterListContainer>
  );
}

const CharacterListContainer = styled.div`
  width: 100%;
`;

const SearchSection = styled.section``;

const ResultsInfo = styled.div`
  text-align: center;
  margin-top: 16px;
`;

const ResultsCount = styled.p`
  color: var(--text-900);
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.7;

  strong {
    color: var(--accent-700);
    font-weight: 600;
    opacity: 1;
  }
`;

const CharactersGrid = styled(Row)`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }

  @media (max-width: 600px) {
    display: block;

    .ant-col {
      width: 100% !important;
      max-width: 100% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
`;

const EmptyState = styled.div`
  padding: 80px 20px;
  text-align: center;
  background: var(--gray-50);
  border-radius: var(--radius-xl);
  margin: 40px 0;
`;

const StyledCard = styled(Card)`
  &.character-card {
    height: 340px;
    border-radius: var(--radius-lg);
    background: var(--white);
    border: 2px solid var(--gray-200);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    color: var(--text-900);
    display: flex;
    flex-direction: column;
    position: relative;

    &:hover {
      border-color: var(--accent-700);
      box-shadow: 0 8px 24px rgba(132, 74, 255, 0.2);
      transform: translateY(-4px);
    }

    .ant-card-body {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      padding: 16px;
      background: var(--white);
      color: var(--text-900);
    }

    .ant-card-actions {
      border-top: none;
      padding: 12px 16px;
      display: flex;
      justify-content: center;
      gap: 8px;
      background: var(--gray-50);
      border-top: 2px solid var(--gray-200);
    }

    @media (max-width: 600px) {
      height: auto;
      border-radius: 12px;
      margin-bottom: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

      .ant-card-actions {
        padding: 12px;
      }
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--gray-100);

  @media (max-width: 600px) {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const CardAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-700), var(--button));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  box-shadow: var(--shadow-md);

  @media (max-width: 600px) {
    width: 48px;
    height: 48px;
  }
`;

const CardTitle = styled.h3`
  font-family: var(--body-font);
  color: var(--accent-700);
  font-weight: 700;
  font-size: 1.2rem;
  margin: 0;
  text-align: center;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 600px) {
    text-align: left;
    font-size: 1.1rem;
  }
`;

const CardContent = styled.div`
  padding: 8px 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  padding: 8px;
  background: var(--gray-50);
  border-radius: var(--radius-sm);
  color: var(--text-900);

  svg {
    color: var(--accent-700);
    flex-shrink: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.9rem;
`;

const InfoValue = styled.span`
  margin-left: auto;
  color: var(--text-900);
  font-weight: 500;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const CustomTag = styled(Tag)`
  &.custom-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.85rem;
  }
`;

const DetailsButton = styled(Button)`
  &.details-button {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: 50%;
    background: var(--white);
    border: 2px solid var(--accent-700);
    color: var(--accent-700);
    transition: all 0.3s ease;
    box-shadow: var(--shadow-sm);

    &:hover {
      background: var(--accent-700);
      color: var(--white);
      transform: scale(1.1);
      box-shadow: var(--shadow-md);
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

const PaginationWrapper = styled.div`
  margin-top: 48px;
  padding: 24px;
  display: flex;
  justify-content: center;
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 2px solid var(--gray-200);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    background: var(--white);
    color: var(--text-900);
    font-family: var(--body-font);
    padding: 24px;
  }

  .ant-drawer-header {
    background: var(--white);
    border-bottom: 2px solid var(--gray-200);
  }

  .ant-drawer-title {
    color: var(--text-900);
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--accent-700);
`;

const DrawerContent = styled(animated.div)`
  padding-bottom: 20px;
`;

const DrawerBlock = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  border-radius: var(--radius-lg);
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--accent-700);
    box-shadow: var(--shadow-sm);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const DrawerBlockTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 1.1rem;
  font-family: var(--body-font);
  color: var(--accent-700);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--gray-200);
`;

const DrawerInfoGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const DrawerInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--white);
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-200);
  color: var(--text-900);
`;

const DrawerIcon = styled.div`
  color: var(--button);
  flex-shrink: 0;
`;

const DrawerLabel = styled.span`
  display: block;
  font-size: 0.85rem;
  color: var(--gray-600);
  font-weight: 600;
`;

const DrawerValue = styled.span`
  display: block;
  font-size: 1rem;
  color: var(--text-900);
  font-weight: 500;
  margin-top: 2px;
`;

const DrawerList = styled.ul`
  padding-left: 0;
  list-style: none;
  margin: 8px 0 0;
`;

const DrawerListItem = styled.li`
  margin: 8px 0;
  padding: 10px 12px;
  background: var(--white);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--button);
  color: var(--text-900);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--gray-100);
    transform: translateX(4px);
  }
`;

const ListIcon = styled.div`
  color: var(--accent-700);
  flex-shrink: 0;
`;

const DrawerEmpty = styled.p`
  color: var(--gray-500);
  font-style: italic;
  margin: 8px 0 0;
  padding: 12px;
  background: var(--white);
  border-radius: var(--radius-sm);
  text-align: center;
`;

const Divider = styled.div`
  margin: 20px 0;
  height: 2px;
  background: linear-gradient(
    to right,
    transparent,
    var(--accent-700),
    transparent
  );
  opacity: 0.3;
`;

const CustomTimeline = styled(Timeline)`
  &.custom-timeline {
    margin: 16px 0 0 12px;
  }
`;

const TimelineDate = styled.span`
  color: var(--gray-600);
  font-size: 0.9rem;
  margin-top: 4px;
`;
