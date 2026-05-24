import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@alwayspet:pets";
const USER_KEY = "@alwayspet:user";

const initialPets = [
  {
    id: 1,
    nome: "Thor",
    especie: "CANINO",
    raca: "Golden Retriever",
    nascimento: "2022-05-10",
    peso: "28",
    responsavel: "Felipe Leal",
    observacao: "Pet ativo, vacinação em acompanhamento."
  },
  {
    id: 2,
    nome: "Luna",
    especie: "FELINO",
    raca: "Siamês",
    nascimento: "2021-08-12",
    peso: "4",
    responsavel: "Felipe Leal",
    observacao: "Acompanhar alimentação e hidratação."
  }
];

const alerts = [
  {
    id: 1,
    titulo: "Vacinação anual",
    descricao: "Verificar atualização da carteira de vacinação.",
    prioridade: "Alta"
  },
  {
    id: 2,
    titulo: "Consulta preventiva",
    descricao: "Consulta de rotina recomendada nos próximos 30 dias.",
    prioridade: "Média"
  },
  {
    id: 3,
    titulo: "Controle de peso",
    descricao: "Acompanhar peso e alimentação semanalmente.",
    prioridade: "Baixa"
  }
];

function Header({ title, subtitle, canBack, onBack }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        {canBack ? (
          <TouchableOpacity style={styles.backPill} onPress={onBack}>
            <Text style={styles.backPillText}>← Voltar</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.brand}>AlwaysPet</Text>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("felipe@alwayspet.com");
  const [senha, setSenha] = useState("123456");

  async function entrar() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Informe e-mail e senha.");
      return;
    }

    await AsyncStorage.setItem(USER_KEY, JSON.stringify({ email }));
    onLogin();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.loginWrapper}>
        <View style={styles.hero}>
          <Text style={styles.heroBrand}>AlwaysPet</Text>
          <Text style={styles.heroTitle}>Saúde pet acompanhada de perto</Text>
          <Text style={styles.heroText}>
            App para gestão de pets, alertas preventivos, histórico e cuidados essenciais.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#7f8ea3"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            placeholderTextColor="#7f8ea3"
            secureTextEntry
          />

          <TouchableOpacity style={styles.primaryButton} onPress={entrar}>
            <Text style={styles.primaryButtonText}>Entrar no aplicativo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({ pets, go }) {
  const totalPets = pets.length;
  const caninos = pets.filter((p) => p.especie?.toUpperCase() === "CANINO").length;
  const felinos = pets.filter((p) => p.especie?.toUpperCase() === "FELINO").length;

  return (
    <ScrollView style={styles.container}>
      <Header
        title="Dashboard"
        subtitle="Resumo da jornada de cuidado dos pets cadastrados."
      />

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Cuidado contínuo, simples e organizado</Text>
        <Text style={styles.bannerText}>
          O AlwaysPet ajuda o tutor a manter dados importantes sempre acessíveis.
        </Text>
      </View>

      <View style={styles.metrics}>
        <Metric value={totalPets} label="Pets" />
        <Metric value={caninos} label="Caninos" />
        <Metric value={felinos} label="Felinos" />
        <Metric value={alerts.length} label="Alertas" />
      </View>

      <ActionCard
        title="Meus Pets"
        description="Visualize a lista completa, detalhes e histórico básico."
        onPress={() => go("pets")}
      />

      <ActionCard
        title="Cadastrar Pet"
        description="Formulário com estado e persistência local."
        onPress={() => go("form")}
      />

      <ActionCard
        title="Alertas Preventivos"
        description="Acompanhe lembretes e pontos de atenção."
        onPress={() => go("alerts")}
      />
    </ScrollView>
  );
}

function Metric({ value, label }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({ title, description, onPress }) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionText}>{description}</Text>
      </View>
      <Text style={styles.actionArrow}>›</Text>
    </TouchableOpacity>
  );
}

function PetsScreen({ pets, go, setSelectedPet, back }) {
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Meus Pets"
        subtitle="Lista salva localmente com AsyncStorage."
        canBack
        onBack={back}
      />

      <FlatList
        data={pets}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
            <Text style={styles.emptyText}>Cadastre o primeiro pet para iniciar o acompanhamento.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.petCard}
            onPress={() => {
              setSelectedPet(item);
              go("details");
            }}
          >
            <View style={styles.petCardTop}>
              <View>
                <Text style={styles.petName}>{item.nome}</Text>
                <Text style={styles.petSpecies}>{item.especie}</Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Ativo</Text>
              </View>
            </View>

            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Raça</Text>
              <Text style={styles.infoValue}>{item.raca || "Não informada"}</Text>
            </View>

            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Peso</Text>
              <Text style={styles.infoValue}>{item.peso || "-"} kg</Text>
            </View>

            <Text style={styles.moreText}>Toque para ver detalhes</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function DetailsScreen({ pet, back }) {
  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Detalhes" subtitle="Pet não selecionado." canBack onBack={back} />
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header
        title={pet.nome}
        subtitle="Ficha resumida de acompanhamento."
        canBack
        onBack={back}
      />

      <View style={styles.profileCard}>
        <Text style={styles.profileInitial}>{pet.nome?.charAt(0) || "P"}</Text>
        <Text style={styles.profileName}>{pet.nome}</Text>
        <Text style={styles.profileSub}>{pet.especie} • {pet.raca}</Text>
      </View>

      <View style={styles.card}>
        <Info title="Nascimento" value={pet.nascimento || "Não informado"} />
        <Info title="Peso" value={`${pet.peso || "-"} kg`} />
        <Info title="Responsável" value={pet.responsavel || "Não informado"} />
        <Info title="Observação" value={pet.observacao || "Sem observações"} />
      </View>

      <View style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>Linha do cuidado</Text>
        <Text style={styles.timelineItem}>• Cadastro ativo no AlwaysPet</Text>
        <Text style={styles.timelineItem}>• Monitoramento preventivo recomendado</Text>
        <Text style={styles.timelineItem}>• Próxima revisão sugerida em 30 dias</Text>
      </View>
    </ScrollView>
  );
}

function Info({ title, value }) {
  return (
    <View style={styles.infoBlock}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoDescription}>{value}</Text>
    </View>
  );
}

function FormScreen({ addPet, back }) {
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("CANINO");
  const [raca, setRaca] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [peso, setPeso] = useState("");
  const [observacao, setObservacao] = useState("");

  function salvar() {
    if (!nome.trim()) {
      Alert.alert("Validação", "Informe o nome do pet.");
      return;
    }

    addPet({
      id: Date.now(),
      nome,
      especie,
      raca,
      nascimento,
      peso,
      responsavel: "Felipe Leal",
      observacao: observacao || "Sem observações."
    });

    Alert.alert("Sucesso", "Pet cadastrado e salvo no aplicativo.");
    back();
  }

  return (
    <ScrollView style={styles.container}>
      <Header
        title="Cadastrar Pet"
        subtitle="Formulário com manipulação de estado e persistência local."
        canBack
        onBack={back}
      />

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Bolt" placeholderTextColor="#7f8ea3" />

        <Text style={styles.label}>Espécie</Text>
        <TextInput style={styles.input} value={especie} onChangeText={setEspecie} placeholder="CANINO ou FELINO" placeholderTextColor="#7f8ea3" />

        <Text style={styles.label}>Raça</Text>
        <TextInput style={styles.input} value={raca} onChangeText={setRaca} placeholder="Ex: Labrador" placeholderTextColor="#7f8ea3" />

        <Text style={styles.label}>Nascimento</Text>
        <TextInput style={styles.input} value={nascimento} onChangeText={setNascimento} placeholder="AAAA-MM-DD" placeholderTextColor="#7f8ea3" />

        <Text style={styles.label}>Peso</Text>
        <TextInput style={styles.input} value={peso} onChangeText={setPeso} placeholder="Ex: 12" placeholderTextColor="#7f8ea3" keyboardType="numeric" />

        <Text style={styles.label}>Observação</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={observacao}
          onChangeText={setObservacao}
          placeholder="Informações importantes sobre o pet"
          placeholderTextColor="#7f8ea3"
          multiline
        />

        <TouchableOpacity style={styles.primaryButton} onPress={salvar}>
          <Text style={styles.primaryButtonText}>Salvar Pet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function AlertsScreen({ back }) {
  return (
    <ScrollView style={styles.container}>
      <Header title="Alertas" subtitle="Cuidados preventivos sugeridos." canBack onBack={back} />

      {alerts.map((item) => (
        <View key={item.id} style={styles.alertCard}>
          <View style={styles.petCardTop}>
            <Text style={styles.alertTitle}>{item.titulo}</Text>
            <Text style={styles.priority}>{item.prioridade}</Text>
          </View>
          <Text style={styles.alertText}>{item.descricao}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function ProfileScreen({ back, resetPets }) {
  return (
    <ScrollView style={styles.container}>
      <Header title="Perfil" subtitle="Dados do usuário e configurações." canBack onBack={back} />

      <View style={styles.profileCard}>
        <Text style={styles.profileInitial}>F</Text>
        <Text style={styles.profileName}>Felipe Wiclif Leal da Silva</Text>
        <Text style={styles.profileSub}>RM 563901 • Grupo AlwaysPet</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        <Text style={styles.timelineItem}>• Tema escuro ativo</Text>
        <Text style={styles.timelineItem}>• Dados salvos localmente com AsyncStorage</Text>
        <Text style={styles.timelineItem}>• Protótipo funcional em Expo</Text>

        <TouchableOpacity style={styles.dangerButton} onPress={resetPets}>
          <Text style={styles.dangerText}>Restaurar dados iniciais</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [screen, setScreen] = useState("login");
  const [history, setHistory] = useState([]);
  const [pets, setPets] = useState(initialPets);
  const [selectedPet, setSelectedPet] = useState(null);

  const isLogged = screen !== "login";

  useEffect(() => {
    loadPets();
  }, []);

  async function loadPets() {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPets(JSON.parse(saved));
    } else {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialPets));
    }
  }

  async function savePets(nextPets) {
    setPets(nextPets);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextPets));
  }

  function go(nextScreen) {
    setHistory((current) => [...current, screen]);
    setScreen(nextScreen);
  }

  function back() {
    setHistory((current) => {
      if (current.length === 0) {
        setScreen("home");
        return [];
      }

      const copy = [...current];
      const previous = copy.pop();
      setScreen(previous || "home");
      return copy;
    });
  }

  async function addPet(pet) {
    await savePets([...pets, pet]);
  }

  async function resetPets() {
    await savePets(initialPets);
    Alert.alert("Dados restaurados", "A lista inicial de pets foi restaurada.");
  }

  const content = useMemo(() => {
    if (screen === "login") {
      return <LoginScreen onLogin={() => setScreen("home")} />;
    }

    if (screen === "home") {
      return <HomeScreen pets={pets} go={go} />;
    }

    if (screen === "pets") {
      return <PetsScreen pets={pets} go={go} setSelectedPet={setSelectedPet} back={back} />;
    }

    if (screen === "details") {
      return <DetailsScreen pet={selectedPet} back={back} />;
    }

    if (screen === "form") {
      return <FormScreen addPet={addPet} back={back} />;
    }

    if (screen === "alerts") {
      return <AlertsScreen back={back} />;
    }

    if (screen === "profile") {
      return <ProfileScreen back={back} resetPets={resetPets} />;
    }

    return null;
  }, [screen, pets, selectedPet]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 1 }}>{content}</View>

      {isLogged ? (
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => setScreen("home")}>
<View style={styles.navItem}>
  <Text style={styles.navEmoji}>🏠</Text>
  <Text style={styles.navText}>Home</Text>
</View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => go("pets")}>
<View style={styles.navItem}>
  <Text style={styles.navEmoji}>🐶</Text>
  <Text style={styles.navText}>Pets</Text>
</View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => go("form")}>
<View style={styles.navItem}>
  <Text style={styles.navEmoji}>➕</Text>
  <Text style={styles.navText}>Novo</Text>
</View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => go("alerts")}>
<View style={styles.navItem}>
  <Text style={styles.navEmoji}>🔔</Text>
  <Text style={styles.navText}>Alertas</Text>
</View>          </TouchableOpacity>

          <TouchableOpacity onPress={() => go("profile")}>
<View style={styles.navItem}>
  <Text style={styles.navEmoji}>👤</Text>
  <Text style={styles.navText}>Perfil</Text>
</View>          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06121d"
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 12
  },

  headerTop: {
    minHeight: 32,
    justifyContent: "center"
  },

  brand: {
    color: "#00d4ff",
    fontWeight: "900",
    fontSize: 18
  },

  backPill: {
    alignSelf: "flex-start",
    backgroundColor: "#0d1d2c",
    borderWidth: 1,
    borderColor: "#1d3244",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999
  },

  backPillText: {
    color: "#ffffff",
    fontWeight: "800"
  },

  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 8
  },

  subtitle: {
    color: "#95a8bc",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8
  },

  loginWrapper: {
    flex: 1,
    justifyContent: "center",
    padding: 24
  },

  hero: {
    marginBottom: 22
  },

  heroBrand: {
    color: "#00d4ff",
    fontSize: 42,
    fontWeight: "900"
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    marginTop: 16
  },

  heroText: {
    color: "#96aabd",
    lineHeight: 22,
    marginTop: 12
  },

  card: {
    backgroundColor: "#0d1d2c",
    borderRadius: 24,
    padding: 22,
    margin: 20,
    borderWidth: 1,
    borderColor: "#1d3244"
  },

  label: {
    color: "#ffffff",
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 6
  },

  input: {
    backgroundColor: "#07131f",
    color: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e3346",
    marginBottom: 12
  },

  textArea: {
    height: 90,
    textAlignVertical: "top"
  },

  primaryButton: {
    backgroundColor: "#00d4ff",
    borderRadius: 18,
    padding: 17,
    alignItems: "center",
    marginTop: 10
  },

  primaryButtonText: {
    color: "#031018",
    fontWeight: "900",
    fontSize: 16
  },

  banner: {
    backgroundColor: "#0d1d2c",
    borderRadius: 24,
    padding: 22,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#1d3244"
  },

  bannerTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900"
  },

  bannerText: {
    color: "#95a8bc",
    lineHeight: 22,
    marginTop: 10
  },

  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    marginTop: 14
  },

  metricCard: {
    width: "46%",
    backgroundColor: "#0d1d2c",
    margin: "2%",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1d3244"
  },

  metricValue: {
    color: "#00d4ff",
    fontSize: 32,
    fontWeight: "900"
  },

  metricLabel: {
    color: "#95a8bc",
    marginTop: 8
  },

  actionCard: {
    backgroundColor: "#0d1d2c",
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#1d3244",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  actionTitle: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 20
  },

  actionText: {
    color: "#95a8bc",
    maxWidth: 260,
    lineHeight: 21,
    marginTop: 8
  },

  actionArrow: {
    color: "#00d4ff",
    fontSize: 36,
    fontWeight: "900"
  },

  petCard: {
    backgroundColor: "#0d1d2c",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1d3244"
  },

  petCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  petName: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900"
  },

  petSpecies: {
    color: "#00d4ff",
    fontWeight: "800",
    marginTop: 4
  },

  statusBadge: {
    backgroundColor: "#00d4ff22",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8
  },

  statusText: {
    color: "#00d4ff",
    fontWeight: "900"
  },

  infoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#173040",
    paddingTop: 12,
    marginTop: 12
  },

  infoLabel: {
    color: "#8195aa"
  },

  infoValue: {
    color: "#ffffff",
    fontWeight: "800"
  },

  moreText: {
    color: "#00d4ff",
    marginTop: 14,
    fontWeight: "800"
  },

  emptyBox: {
    backgroundColor: "#0d1d2c",
    padding: 22,
    borderRadius: 22,
    alignItems: "center"
  },

  emptyTitle: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 18
  },

  emptyText: {
    color: "#95a8bc",
    textAlign: "center",
    marginTop: 8
  },

  profileCard: {
    backgroundColor: "#0d1d2c",
    margin: 20,
    borderRadius: 26,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1d3244"
  },

  profileInitial: {
    backgroundColor: "#00d4ff",
    color: "#031018",
    width: 72,
    height: 72,
    borderRadius: 36,
    textAlign: "center",
    lineHeight: 72,
    fontSize: 34,
    fontWeight: "900",
    overflow: "hidden"
  },

  profileName: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 16,
    textAlign: "center"
  },

  profileSub: {
    color: "#95a8bc",
    marginTop: 8,
    textAlign: "center"
  },

  infoBlock: {
    borderBottomWidth: 1,
    borderBottomColor: "#173040",
    paddingVertical: 14
  },

  infoTitle: {
    color: "#8195aa",
    marginBottom: 6
  },

  infoDescription: {
    color: "#ffffff",
    fontWeight: "700",
    lineHeight: 21
  },

  timelineCard: {
    backgroundColor: "#0d1d2c",
    marginHorizontal: 20,
    marginBottom: 110,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#1d3244"
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12
  },

  timelineItem: {
    color: "#95a8bc",
    lineHeight: 24,
    marginTop: 4
  },

  alertCard: {
    backgroundColor: "#0d1d2c",
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 24,
    padding: 22,
    borderLeftWidth: 5,
    borderLeftColor: "#00d4ff"
  },

  alertTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900"
  },

  alertText: {
    color: "#95a8bc",
    lineHeight: 22,
    marginTop: 10
  },

  priority: {
    color: "#00d4ff",
    fontWeight: "900"
  },

  dangerButton: {
    backgroundColor: "#ff4d4d22",
    borderWidth: 1,
    borderColor: "#ff6666",
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    alignItems: "center"
  },

  dangerText: {
    color: "#ff9b9b",
    fontWeight: "900"
  },

bottomBar: {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "#08131f",
  borderTopWidth: 1,
  borderTopColor: "#173040",
  paddingVertical: 16,
  paddingBottom: 22,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: -2
  },
  shadowOpacity: 0.25,
  shadowRadius: 10,
  elevation: 10
},

navText: {
  color: "#ffffff",
  fontWeight: "800",
  fontSize: 11,
  marginTop: 4
},

navItem: {
  alignItems: "center",
  justifyContent: "center"
},

navEmoji: {
  fontSize: 20
}
});
