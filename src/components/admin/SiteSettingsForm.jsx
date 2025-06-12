import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from "@/components/ui/use-toast";
    import { getSiteConfig, saveSiteConfig, subscribeToConfigChanges } from '@/lib/tourData';
    import { Globe, Image as ImageIcon, Shuffle } from 'lucide-react';

    const SiteSettingsForm = () => {
        const { toast } = useToast();
        const [config, setConfig] = useState({
            siteName: '',
            logoUrl: '',
            heroImage1: '',
            heroAlt1: '',
            heroImage2: '',
            heroAlt2: '',
            heroImage3: '',
            heroAlt3: '',
            heroImage4: '',
            heroAlt4: '',
            defaultShareImage: '',
            currencySymbol: 'R$',
            currencyCode: 'BRL', // e.g., USD, BRL, CLP
        });

        useEffect(() => {
        let isMounted = true;
        let unsubscribe = () => {};

        const loadConfig = async () => {
            try {
                console.log('Cargando configuración inicial...');
                const currentConfig = await getSiteConfig();
                if (isMounted) {
                    console.log('Configuración cargada:', currentConfig);
                    setConfig(prevConfig => ({ ...prevConfig, ...currentConfig }));
                }
            } catch (error) {
                console.error('Error al cargar la configuración:', error);
                if (isMounted) {
                    toast({
                        title: "Error al cargar configuración",
                        description: error.message || "No se pudo cargar la configuración del sitio.",
                        variant: "destructive"
                    });
                }
            }
        };
        
        // Cargar configuración inicial
        loadConfig();
        
        // Configurar suscripción a cambios en tiempo real
        try {
            console.log('Configurando suscripción a cambios...');
            unsubscribe = subscribeToConfigChanges((updatedConfig) => {
                console.log('Recibida actualización en tiempo real:', updatedConfig);
                if (isMounted) {
                    setConfig(prev => ({
                        ...prev,
                        ...updatedConfig
                    }));
                    toast({
                        title: "Configuración actualizada",
                        description: "Los cambios se han sincronizado correctamente.",
                        variant: "default"
                    });
                }
            });
        } catch (error) {
            console.error('Error al configurar la suscripción:', error);
            toast({
                title: "Error de conexión",
                description: "No se pudo establecer la conexión en tiempo real. Los cambios no se sincronizarán automáticamente.",
                variant: "destructive"
            });
        }
        
        // Limpiar al desmontar
        return () => {
            isMounted = false;
            console.log('Limpiando suscripción...');
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, []);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setConfig(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                await saveSiteConfig(config);
                toast({ 
                    title: "Configurações Salvas", 
                    description: "As configurações do site foram atualizadas com sucesso!" 
                });
            } catch (error) {
                console.error("Erro ao salvar configurações:", error);
                toast({ 
                    title: "Erro ao Salvar", 
                    description: error.message || "Não foi possível salvar as configurações.", 
                    variant: "destructive" 
                });
            }
        };

        return (
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-primary flex items-center">
                        <Globe className="mr-3 h-8 w-8" /> Configurações Gerais do Site
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Gerencie as informações globais e imagens principais do seu site.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="p-6 border rounded-lg shadow-sm bg-card">
                        <h3 className="text-xl font-semibold mb-4 text-secondary flex items-center">
                            <ImageIcon className="mr-2 h-5 w-5" /> Identidade Visual
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="siteName">Nome do Site</Label>
                                <Input 
                                    id="siteName" 
                                    name="siteName" 
                                    value={config.siteName || ''} 
                                    onChange={handleChange} 
                                    placeholder="Ex: Vibe Chile"
                                />
                            </div>
                            <div>
                                <Label htmlFor="logoUrl">URL do Logotipo</Label>
                                <Input 
                                    id="logoUrl" 
                                    name="logoUrl" 
                                    value={config.logoUrl || ''} 
                                    onChange={handleChange} 
                                    placeholder="https://exemplo.com/logo.png"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Insira a URL completa do logotipo. Será exibido no cabeçalho.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border rounded-lg shadow-sm bg-card">
                        <h3 className="text-xl font-semibold mb-4 text-secondary flex items-center">
                            <Shuffle className="mr-2 h-5 w-5" /> Carrossel da Página Inicial
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">Configure as imagens para o carrossel da página inicial.</p>
                        {[1, 2, 3, 4].map(num => (
                            <div key={num} className="space-y-4 border-t pt-4 mt-4 first:border-t-0 first:mt-0 first:pt-0">
                                <h4 className="font-medium text-primary">Imagem {num}</h4>
                                <div>
                                    <Label htmlFor={`heroImage${num}`}>URL da Imagem {num}</Label>
                                    <Input 
                                        id={`heroImage${num}`} 
                                        name={`heroImage${num}`} 
                                        value={config[`heroImage${num}`] || ''} 
                                        onChange={handleChange} 
                                        placeholder={`https://exemplo.com/hero${num}.jpg`}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`heroAlt${num}`}>Texto Alternativo da Imagem {num}</Label>
                                    <Input 
                                        id={`heroAlt${num}`} 
                                        name={`heroAlt${num}`} 
                                        value={config[`heroAlt${num}`] || ''} 
                                        onChange={handleChange} 
                                        placeholder={`Descrição da imagem ${num}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-6 border rounded-lg shadow-sm bg-card">
                        <h3 className="text-xl font-semibold mb-4 text-secondary">Configurações de Moeda</h3>
                         <div className="space-y-4">
                            <div>
                                <Label htmlFor="currencySymbol">Símbolo da Moeda Principal</Label>
                                <Input 
                                    id="currencySymbol" 
                                    name="currencySymbol" 
                                    value={config.currencySymbol || 'R$'} 
                                    onChange={handleChange} 
                                    placeholder="R$"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Ex: R$, $, €</p>
                            </div>
                            <div>
                                <Label htmlFor="currencyCode">Código da Moeda Principal (ISO 4217)</Label>
                                <Input 
                                    id="currencyCode" 
                                    name="currencyCode" 
                                    value={config.currencyCode || 'BRL'} 
                                    onChange={handleChange} 
                                    placeholder="BRL"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Ex: BRL (Real Brasileiro), USD (Dólar Americano), CLP (Peso Chileno)</p>
                            </div>
                        </div>
                    </div>


                    <div className="p-6 border rounded-lg shadow-sm bg-card">
                        <h3 className="text-xl font-semibold mb-4 text-secondary">Metadados e SEO</h3>
                         <div>
                            <Label htmlFor="defaultShareImage">URL da Imagem Padrão para Compartilhamento Social</Label>
                            <Input 
                                id="defaultShareImage" 
                                name="defaultShareImage" 
                                value={config.defaultShareImage || ''} 
                                onChange={handleChange} 
                                placeholder="https://exemplo.com/default-share.jpg"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Imagem usada ao compartilhar links do site em redes sociais (recomendado 1200x630px).</p>
                        </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                        Salvar Configurações
                    </Button>
                </form>
            </div>
        );
    };

    export default SiteSettingsForm;