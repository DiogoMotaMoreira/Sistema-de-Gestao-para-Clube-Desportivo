/**
 * Roles RBAC — SIGD (8 perfis)
 *
 * Mapeamento direto da tabela de roles do AGENTS.md.
 * Inclui helpers para determinar o tipo de layout por role.
 */

export enum Role {
  ADMIN = 'ROLE_ADMIN',
  CEO = 'ROLE_CEO',
  CFO = 'ROLE_CFO',
  SECRETARIA = 'ROLE_SECRETARIA',
  DIRETOR_TECNICO = 'ROLE_DIRETOR_TECNICO',
  MEDICO = 'ROLE_MEDICO',
  TREINADOR = 'ROLE_TREINADOR',
  EE = 'ROLE_EE',
  ATLETA = 'ROLE_ATLETA',
}

/** Tipo de layout de navegação */
export type LayoutType = 'desktop' | 'treinador' | 'portal';

/** Roles que usam layout Desktop (Sidebar / Drawer) */
const DESKTOP_ROLES: ReadonlySet<Role> = new Set([
  Role.ADMIN,
  Role.CEO,
  Role.CFO,
  Role.SECRETARIA,
  Role.DIRETOR_TECNICO,
  Role.MEDICO,
]);

/** Roles que usam layout Mobile — Treinador (Bottom Tabs 4 itens) */
const TREINADOR_ROLES: ReadonlySet<Role> = new Set([
  Role.TREINADOR,
]);

/** Roles que usam layout Mobile — Portal B2C (Bottom Tabs 5 itens) */
const PORTAL_ROLES: ReadonlySet<Role> = new Set([
  Role.EE,
  Role.ATLETA,
]);

/**
 * Determina o tipo de layout para um dado role.
 */
export function getLayoutType(role: Role): LayoutType {
  if (DESKTOP_ROLES.has(role)) return 'desktop';
  if (TREINADOR_ROLES.has(role)) return 'treinador';
  if (PORTAL_ROLES.has(role)) return 'portal';
  return 'desktop'; // fallback seguro
}

/**
 * Hierarquia de prioridade para resolver multi-role.
 * Roles Desktop têm prioridade > Treinador > Portal.
 * Dentro de cada grupo, segue a ordem da lista.
 */
const ROLE_PRIORITY: readonly Role[] = [
  Role.ADMIN,
  Role.CEO,
  Role.CFO,
  Role.SECRETARIA,
  Role.DIRETOR_TECNICO,
  Role.MEDICO,
  Role.TREINADOR,
  Role.EE,
  Role.ATLETA,
];

/**
 * Dado um array de roles do JWT, retorna o role com maior prioridade.
 */
export function resolveActiveRole(roles: Role[]): Role {
  for (const candidate of ROLE_PRIORITY) {
    if (roles.includes(candidate)) {
      return candidate;
    }
  }
  return roles[0]; // fallback
}

/**
 * Labels legíveis para a UI (sem o prefixo "ROLE_").
 */
export const RoleLabels: Record<Role, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.CEO]: 'Presidência',
  [Role.CFO]: 'Direção Financeira',
  [Role.SECRETARIA]: 'Secretaria',
  [Role.DIRETOR_TECNICO]: 'Direção Técnica',
  [Role.MEDICO]: 'Departamento Médico',
  [Role.TREINADOR]: 'Treinador',
  [Role.EE]: 'Encarregado de Educação',
  [Role.ATLETA]: 'Atleta',
};
