/**
 * PerfilScreen — Perfil do Treinador
 *
 * Mostra dados reais do utilizador autenticado via authStore.
 * Inclui informação de role, equipa e botão de logout.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { User as UserIcon, Shield, LogOut, Info } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { RoleLabels, Role } from '../../constants/roles';

// ── Helpers ───────────────────────────────────────────────

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatRoleLabel(role: string | null): string {
  if (!role) return 'Sem perfil';
  return RoleLabels[role as Role] ?? role.replace('ROLE_', '').replace(/_/g, ' ');
}

// ── Subcomponent: InfoRow ─────────────────────────────────

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────

export function PerfilScreen(): React.JSX.Element {
  const { user, activeRole, logout } = useAuthStore();

  const displayName = user?.name
    ? capitalize(user.name)
    : 'Utilizador';

  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar + Nome */}
      <View style={s.profileCard}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initials || 'U'}</Text>
        </View>
        <Text style={s.name}>{displayName}</Text>

        {/* Role Badge */}
        <View style={s.roleBadge}>
          <Shield size={13} color="#047857" />
          <Text style={s.roleBadgeText}>{formatRoleLabel(activeRole)}</Text>
        </View>
      </View>

      {/* Informações da conta */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>CONTA</Text>
        <View style={s.sectionCard}>
          <InfoRow label="Nome de utilizador" value={user?.name ?? '—'} />
          <View style={s.separator} />
          <InfoRow label="Perfil de acesso" value={formatRoleLabel(activeRole)} />
          <View style={s.separator} />
          <InfoRow label="Equipa" value="Sub-15 A" />
        </View>
      </View>

      {/* Informação do sistema */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>SISTEMA</Text>
        <View style={s.sectionCard}>
          <View style={s.infoNote}>
            <Info size={14} color={Colors.GRAY_500_TEXTO2} />
            <Text style={s.infoNoteText}>
              Os dados do seu perfil são geridos pelo Administrador de Sistema.
              Para alterações, contacte a equipa de suporte.
            </Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <View style={s.logoutSection}>
        <Button
          label="Terminar Sessão"
          variant="destructive"
          onPress={logout}
          fullWidth
          icon={<LogOut size={18} color="#991B1B" />}
        />
      </View>
    </ScrollView>
  );
}

// ── Styles ────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GRAY_50_FUNDO,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 20,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: Colors.BRANCO,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.DOURADO_CTA,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.PRETO_PRIMARIO,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.GRAY_900_TEXTO1,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#047857',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.GRAY_500_TEXTO2,
    letterSpacing: 0.8,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: Colors.BRANCO,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_200_BORDAS,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.GRAY_500_TEXTO2,
    fontWeight: '400',
  },
  infoValue: {
    fontSize: 14,
    color: Colors.GRAY_900_TEXTO1,
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 16,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.GRAY_200_BORDAS,
    marginHorizontal: 16,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 16,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.GRAY_500_TEXTO2,
    lineHeight: 20,
  },
  logoutSection: {
    marginTop: 8,
  },
});
