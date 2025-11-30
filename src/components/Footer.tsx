import styled from "styled-components";

const Footer = () => {
  return (
    <FooterWrapper>
      <Content>
        <FooterTitle>Star Wars - SWAPI</FooterTitle>
        <FooterText>© 2025 Andreza Sousa - Teste de Front-end Jr</FooterText>
        <FooterText>
          Desenvolvido com React, TypeScript, Ant Design e Styled Components
        </FooterText>
        <FooterLinks>
          <FooterLink
            href="https://swapi.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Star Wars API
          </FooterLink>
          <FooterLink
            href="https://www.smartnx.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            SMARTNX
          </FooterLink>
        </FooterLinks>
      </Content>
    </FooterWrapper>
  );
};

export default Footer;

const FooterWrapper = styled.footer`
  background: #00112b;
  color: #ffffff;
  padding: 3rem 0 2rem 0;
  margin-top: 4rem;
  border-top: 1px solid rgba(240, 20, 30, 0.2);

  @media (max-width: 768px) {
    padding: 2rem 0 1.5rem 0;
    margin-top: 3rem;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 0 0.75rem;
  }
`;

const FooterTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #f0141e;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const FooterText = styled.p`
  margin: 0.5rem 0;
  opacity: 0.8;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
    margin-top: 1rem;
  }
`;

const FooterLink = styled.a`
  color: #f0141e;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    color: #ffffff;
    text-decoration: underline;
  }
`;
